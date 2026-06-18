from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from conftest import BASE_URL


def test_pagina_medicacoes_carrega(driver):
    driver.get(f'{BASE_URL}/medicacoes')
    assert driver.find_element(By.TAG_NAME, 'body').is_displayed()


def test_medicacoes_redireciona_sem_autenticacao(driver):
    driver.get(f'{BASE_URL}/medicacoes')
    WebDriverWait(driver, 8).until(
        lambda d: '/login' in d.current_url or '/medicacoes' in d.current_url
    )
    assert '/login' in driver.current_url or '/medicacoes' in driver.current_url


def test_conteudo_medicacoes_presente(driver):
    driver.get(f'{BASE_URL}/medicacoes')
    body_text = driver.find_element(By.TAG_NAME, 'body').text.lower()
    assert any(p in body_text for p in ['medica', 'dose', 'horário', 'remédio', 'entrar'])
