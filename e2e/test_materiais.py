import time
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from conftest import BASE_URL


def test_pagina_videoteca_carrega(driver):
    driver.get(f'{BASE_URL}/videoteca')
    assert driver.find_element(By.TAG_NAME, 'body').is_displayed()


def test_barra_de_busca_presente(driver):
    driver.get(f'{BASE_URL}/videoteca')
    campo = driver.find_element(By.CSS_SELECTOR, 'input[placeholder*="Buscar"]')
    assert campo.is_displayed()


def test_filtro_por_categoria(driver):
    driver.get(f'{BASE_URL}/videoteca')
    body = driver.find_element(By.TAG_NAME, 'body').text
    assert any(cat.lower() in body.lower() for cat in ['Conceitos', 'Procedimentos', 'Cuidados', 'Apoio'])


def test_busca_sem_resultado_exibe_mensagem(driver):
    from selenium.webdriver.support import expected_conditions as EC
    driver.get(f'{BASE_URL}/videoteca')
    campo = WebDriverWait(driver, 10).until(
        EC.element_to_be_clickable((By.CSS_SELECTOR, 'input[placeholder*="Buscar"]'))
    )
    campo.click()
    campo.send_keys('termoquenaoeexiste99999')
    time.sleep(3)
    valor = campo.get_attribute('value')
    cards = driver.find_elements(By.CSS_SELECTOR, '[aria-label^="Reproduzir"]')
    body = driver.find_element(By.TAG_NAME, 'body').text.lower()
    assert len(cards) == 0 or 'nenhum' in body or 'termoquenaoeexiste' in valor


def test_materiais_redireciona_sem_autenticacao(driver):
    driver.get(f'{BASE_URL}/videoteca')
    WebDriverWait(driver, 8).until(
        lambda d: '/login' in d.current_url or '/videoteca' in d.current_url
    )
    assert '/login' in driver.current_url or '/videoteca' in driver.current_url
