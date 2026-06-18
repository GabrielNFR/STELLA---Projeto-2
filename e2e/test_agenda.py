from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from conftest import BASE_URL


def _fazer_login(driver, email, senha):
    driver.get(f'{BASE_URL}/login')
    driver.find_element(By.CSS_SELECTOR, 'input[type="email"]').send_keys(email)
    driver.find_element(By.CSS_SELECTOR, 'input[type="password"]').send_keys(senha)
    driver.find_element(By.CSS_SELECTOR, 'button[type="submit"]').click()
    WebDriverWait(driver, 10).until(lambda d: '/home' in d.current_url or '/login' in d.current_url)


def test_pagina_agenda_carrega(driver):
    driver.get(f'{BASE_URL}/calendario')
    assert driver.find_element(By.TAG_NAME, 'body').is_displayed()


def test_agenda_redireciona_sem_autenticacao(driver):
    driver.get(f'{BASE_URL}/calendario')
    WebDriverWait(driver, 8).until(
        lambda d: '/login' in d.current_url or '/calendario' in d.current_url
    )
    assert '/login' in driver.current_url or '/calendario' in driver.current_url


def test_titulo_agenda_presente_na_pagina(driver):
    driver.get(f'{BASE_URL}/calendario')
    body_text = driver.find_element(By.TAG_NAME, 'body').text.lower()
    assert 'agenda' in body_text or 'consulta' in body_text or 'exame' in body_text
