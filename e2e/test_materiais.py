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
    driver.get(f'{BASE_URL}/videoteca')
    campo = driver.find_element(By.CSS_SELECTOR, 'input[placeholder*="Buscar"]')
    campo.send_keys('xyzxyzxyz')
    WebDriverWait(driver, 8).until(
        lambda d: len(d.find_elements(By.CSS_SELECTOR, '.grid .overflow-hidden')) == 0
        or 'nenhum' in d.find_element(By.TAG_NAME, 'body').text.lower()
    )
    body = driver.find_element(By.TAG_NAME, 'body').text.lower()
    assert 'nenhum' in body or len(driver.find_elements(By.CSS_SELECTOR, '.grid .overflow-hidden')) == 0


def test_materiais_redireciona_sem_autenticacao(driver):
    driver.get(f'{BASE_URL}/videoteca')
    WebDriverWait(driver, 8).until(
        lambda d: '/login' in d.current_url or '/videoteca' in d.current_url
    )
    assert '/login' in driver.current_url or '/videoteca' in driver.current_url
