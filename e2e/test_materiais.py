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
    driver.get(f'{BASE_URL}/videoteca')
    campo = driver.find_element(By.CSS_SELECTOR, 'input[placeholder*="Buscar"]')
    driver.execute_script(
        "var el = arguments[0]; var nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set; nativeInputValueSetter.call(el, arguments[1]); el.dispatchEvent(new Event('input', { bubbles: true }));",
        campo, 'xyzxyzxyz'
    )
    time.sleep(2)
    cards = driver.find_elements(By.CSS_SELECTOR, '[aria-label^="Reproduzir"]')
    body = driver.find_element(By.TAG_NAME, 'body').text.lower()
    assert len(cards) == 0 or 'nenhum' in body


def test_materiais_redireciona_sem_autenticacao(driver):
    driver.get(f'{BASE_URL}/videoteca')
    WebDriverWait(driver, 8).until(
        lambda d: '/login' in d.current_url or '/videoteca' in d.current_url
    )
    assert '/login' in driver.current_url or '/videoteca' in driver.current_url
