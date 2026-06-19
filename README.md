# STELLA | Plataforma de Acompanhamento de Tratamento de FIV

<div align="center">

![](https://img.shields.io/badge/Django-092E20?style=for-the-badge&logo=django&logoColor=white)
![](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)
![](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

![Status](https://img.shields.io/badge/Status-Em%20Desenvolvimento-blueviolet?style=for-the-badge)
![Deploy](https://img.shields.io/badge/Deploy-Azure-0078D4?style=for-the-badge&logo=microsoftazure&logoColor=white)
![Grupo](https://img.shields.io/badge/Grupo%2010-CESAR%20School-red?style=for-the-badge)
![CI/CD](https://github.com/GabrielNFR/STELLA---Projeto-2/actions/workflows/ci-cd.yml/badge.svg)

</div>

Aplicação web para acompanhamento de tratamento de Fertilização In Vitro (FIV), desenvolvida para pacientes da Clínica AMARE. A plataforma centraliza informações, medicações, consultas e documentos, devolvendo à paciente a sensação de controle e segurança durante toda a jornada.

## Equipe — Grupo 10

**Computação**

<table>
  <tr>
    <td align="center"><a href="https://github.com/eliancunha"><b>Elian Cunha</b></a></td>
    <td align="center"><a href="https://github.com/GabrielNFR"><b>Gabriel Rocha</b></a></td>
    <td align="center"><a href="https://github.com/lucasberenguer"><b>Lucas Berenguer</b></a></td>
    <td align="center"><a href="https://github.com/eduardommb"><b>Luiz Braga</b></a></td>
  </tr>
  <tr>
    <td align="center"><a href="https://github.com/MGBcode"><b>Matheus Britto</b></a></td>
    <td align="center"><a href="https://github.com/malucoelho"><b>Maria Luiza Coelho</b></a></td>
    <td align="center"><a href="https://github.com/Rbekah"><b>Rebeca Ferraz</b></a></td>
    <td></td>
  </tr>
</table>

**Design**

<table>
  <tr>
    <td align="center"><a href="https://github.com/gmsc-byte"><b>Graziela Martins</b></a></td>
    <td align="center"><a href="https://github.com/jpcassemiro0"><b>João Cassemiro</b></a></td>
    <td align="center"><a href="https://github.com/EduardaBessa"><b>Maria Eduarda Bessa</b></a></td>
  </tr>
</table>

## Entregas

<details>
<summary>Entrega 01 | Histórias de Usuário e Protótipo Lo-Fi</summary>

#### Histórias de Usuário
[Clique aqui para acessar o documento de histórias de usuário](https://docs.google.com/document/d/1RIJzqYiuKv_tJb9Deknhmri_eNLkZNZRwsHHddazOM4/edit?tab=t.0)

#### Protótipo Lo-Fi (Figma)
[Clique aqui para acessar o protótipo Lo-Fi no Figma](https://www.figma.com/design/ZLL48wZw7k46SFmisSLWfX/Stella-Prototype-Lo-Fi?node-id=0-1&p=f&t=CSNVeULHPBKwifRN-0)

#### Quadro da Sprint e Backlog (JIRA)
[Clique aqui para acessar o JIRA](https://projetos2stella.atlassian.net/jira/software/projects/SCRUM/boards/1/backlog)

<img src="assets/1.png" width="800">
<img src="assets/2.png" width="800">
</details>

<details>
<summary>Entrega 02 | Implementação e Deploy</summary>

#### Histórias Implementadas
- H1.1: Visualizar linha do tempo do tratamento
- H1.2: Adicionar consulta ou exame na agenda
- H1.3: Modo co-piloto
- H2.1: Registro integrado de medicação e sintomas
- H2.2: Diário de emoções
- H2.3: Alertas de medicação

#### Deploy em Produção (Azure)
[lively-pebble-0ccda8e0f.7.azurestaticapps.net](https://lively-pebble-0ccda8e0f.7.azurestaticapps.net)

**Instruções de acesso:**
1. Acesse o link acima
2. Faça login com as credenciais fornecidas pela clínica
3. Navegue pelas funcionalidades pelo menu lateral

#### Screencast do Sistema
_(a preencher — link YouTube. A URL do deploy deve aparecer durante todo o vídeo)_

#### Programação em Par


#### Issue/Bug Tracker (GitHub)
[Clique aqui para acessar o Bug Tracker](https://github.com/GabrielNFR/STELLA---Projeto-2/issues)

![Bug Tracker - Sprint 02](assets/screenshots/bugtracker-sprint02.png)

#### Quadro da Sprint 02 (JIRA)
[Clique aqui para acessar o JIRA](https://projetos2stella.atlassian.net/jira/software/projects/SCRUM/boards/1/backlog)

![Quadro Sprint 02](assets/screenshots/quadro-sprint02.png)

</details>

<details>
<summary>Entrega 03 | Novas Histórias e Testes E2E</summary>

#### Histórias Implementadas
- H3.1: Acesso rápido a suporte emocional
- H3.2: Visualização de materiais educativos

#### Deploy em Produção
[lively-pebble-0ccda8e0f.7.azurestaticapps.net](https://lively-pebble-0ccda8e0f.7.azurestaticapps.net)

#### Screencast das Novas Histórias
_(a preencher — link YouTube. A URL do deploy deve aparecer durante todo o vídeo)_

#### Testes E2E (Selenium)
Os testes automatizados cobrem todas as histórias implementadas, simulando um usuário real no navegador com Selenium + ChromeDriver. São 23 testes no total.

**Como executar:**
```bash
pip install -r e2e/requirements.txt
cd e2e
pytest --verbosity=2
```

_(a preencher — link YouTube do screencast dos testes)_

#### Programação em Par
_(a preencher — atualização do relato)_

#### Issue/Bug Tracker (GitHub)
[Clique aqui para acessar o Bug Tracker](https://github.com/GabrielNFR/STELLA---Projeto-2/issues)

_(a preencher — print da tela)_

#### Quadro da Sprint 03 (JIRA)
[Clique aqui para acessar o JIRA](https://projetos2stella.atlassian.net/jira/software/projects/SCRUM/boards/1/backlog)

_(a preencher — print do quadro)_

</details>

<details>
<summary>Entrega 04 | CI/CD e Entrega Final</summary>

#### Histórias Implementadas
_(a preencher — histórias desta sprint)_

#### Deploy em Produção
[lively-pebble-0ccda8e0f.7.azurestaticapps.net](https://lively-pebble-0ccda8e0f.7.azurestaticapps.net)

#### Screencast das Novas Histórias
_(a preencher — link YouTube. A URL do deploy deve aparecer durante todo o vídeo)_

#### CI/CD (GitHub Actions)
O pipeline automatiza os testes e o deploy na Azure a cada push na branch main. São 32 testes de API e 23 testes E2E executados automaticamente.

[Clique aqui para acessar o pipeline no GitHub](https://github.com/GabrielNFR/STELLA---Projeto-2/actions)

_(a preencher — link YouTube do screencast do CI/CD)_

#### Testes E2E Atualizados (Selenium)
_(a preencher — link YouTube)_

#### Programação em Par
_(a preencher — atualização do relato)_

#### Issue/Bug Tracker (GitHub)
[Clique aqui para acessar o Bug Tracker](https://github.com/GabrielNFR/STELLA---Projeto-2/issues)

_(a preencher — print da tela)_

#### Quadro da Sprint 04 (JIRA)
[Clique aqui para acessar o JIRA](https://projetos2stella.atlassian.net/jira/software/projects/SCRUM/boards/1/backlog)

_(a preencher — print do quadro)_

</details>

## Como Contribuir
Veja o [CONTRIBUTING.md](CONTRIBUTING.md) para instruções de configuração, testes e fluxo de trabalho.

## Tecnologias

- **Back-end:** Python 3.13 + Django 6.0 + Django REST Framework
- **Banco de dados:** SQLite (desenvolvimento) / Azure (produção)
- **Front-end:** React 19 + TypeScript + Vite + Tailwind CSS
- **Deploy:** Azure App Service + Azure Static Web Apps
- **Versionamento:** Git + GitHub
- **Testes:** Django APITestCase (32 testes de API) + Selenium (23 testes E2E)
- **CI/CD:** GitHub Actions

## Design

<details>
<summary>Protótipos e Materiais Visuais</summary>

- [Protótipo de Baixa Fidelidade](https://www.figma.com/design/ZLL48wZw7k46SFmisSLWfX/Stella-Prototype-Lo-Fi?node-id=0-1&p=f&t=CSNVeULHPBKwifRN-0) — Figma
- [Moodboard](https://www.canva.com/design/DAHDvoMTJLM/hqSTHFc9RPufExeDf4PjRQ/edit) — Canva
- Protótipo de Alta Fidelidade — _(a preencher)_

</details>

## Documentação Adicional

<details>
<summary>Pesquisa e Ideação</summary>

- [Desk Research](https://docs.google.com/document/d/103ANIAQEadMIuUWM5kwDZSC6n_t9JuYM/edit?usp=sharing&ouid=114405899175167523343&rtpof=true&sd=true)
- [Persona Atualizada](https://drive.google.com/file/d/1wgp92xa3uX5PLMOYIk8wnQdO4MMINlj6/view?usp=sharing)
- [User Persona e Mapa de Empatia](https://drive.google.com/file/d/1NdK3WL01cuPxQS-SSHuRN6z5Bv3bWr1/view?usp=sharing)
- [Análise de Similares](https://docs.google.com/spreadsheets/d/1EXk8t48OFYPi4eDS5xwMWSmszn31NcQv/edit?gid=1863085712#gid=1863085712)
- [Brainwriting](https://docs.google.com/document/d/1a0morUqkvJggSA7stWC4wUgFSRDEOz4JvdUXPtAnDRw/edit?tab=t.0#heading=h.o8fytvu8u3nu)
- [Pesquisa de Funcionalidades](https://docs.google.com/document/d/1dPnY5OtfrhOSahmPvxDl5e3fdWpJNLIJ2oGrlhVgidM/edit?usp=sharing)
- [Google Drive — Arquivos do Projeto](https://drive.google.com/drive/folders/1CKaAAoIi-wBSr-T2X3tDdhf3aRNBKza5?usp=sharing)
- [Google Sites — Documentação](https://sites.google.com/cesar.school/stella/home)

</details>

<div align="center">

Desenvolvido pelo Grupo 10 — CESAR School — 2026

</div>
