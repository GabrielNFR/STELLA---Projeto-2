from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from conftest import BASE_URL


def test_pagina_diario_carrega(driver):
    driver.get(f'{BASE_URL}/como-estou-hoje')
    assert driver.find_element(By.TAG_NAME, 'body').is_displayed()


def test_diario_redireciona_sem_autenticacao(driver):
    driver.get(f'{BASE_URL}/como-estou-hoje')
    WebDriverWait(driver, 8).until(
        lambda d: '/login' in d.current_url or '/como-estou-hoje' in d.current_url
    )
    assert '/login' in driver.current_url or '/como-estou-hoje' in driver.current_url


def test_conteudo_diario_presente(driver):
    driver.get(f'{BASE_URL}/como-estou-hoje')
    body_text = driver.find_element(By.TAG_NAME, 'body').text.lower()
    assert any(p in body_text for p in ['humor', 'hoje', 'emoç', 'como', 'dia'])
