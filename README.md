[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/GGgTBf2_)
[![Open in Codespaces](https://classroom.github.com/assets/launch-codespace-2972f46106e565e64193e422d61a12cf1da4916b45550586e14ef0a7c637dd04.svg)](https://classroom.github.com/open-in-codespaces?assignment_repo_id=21582530)

# Trabalho Prático 07 - Semanas 13 e 14

A partir dos dados cadastrados na etapa anterior, vamos trabalhar formas de apresentação que representem de forma clara e interativa as informações do seu projeto. Você poderá usar gráficos (barra, linha, pizza), mapas, calendários ou outras formas de visualização. Seu desafio é entregar uma página Web que organize, processe e exiba os dados de forma compreensível e esteticamente agradável.

Com base nos tipos de projetos escohidos, você deve propor **visualizações que estimulem a interpretação, agrupamento e exibição criativa dos dados**, trabalhando tanto a lógica quanto o design da aplicação.

Sugerimos o uso das seguintes ferramentas acessíveis: [FullCalendar](https://fullcalendar.io/), [Chart.js](https://www.chartjs.org/), [Mapbox](https://docs.mapbox.com/api/), para citar algumas.

## Informações do trabalho

- Nome: Igor Gabriel Rodrigues
- Matricula: 1654075
- Proposta de projeto escolhida: Games 
- Breve descrição sobre seu projeto: site sobre jogos antigos 

**Print da tela com a implementação**

Funcionalidades Implementadas:
Nova Página de Dashboard:

Foi criado o arquivo public/dashboard.html para servir como a tela de visualização dos gráficos.

Um novo link ("Dashboard") foi adicionado à barra de navegação principal em todas as páginas (index.html, detalhe.html, cadastro_jogo.html) para garantir o acesso fácil à nova funcionalidade.

Consumo de API e Processamento de Dados:

A página utiliza um novo script, public/assets/js/dashboard.js.

Este script é responsável por fazer uma requisição GET à API do json-server (http://localhost:3000/games) assim que a página é carregada.

Após receber o JSON com a lista de jogos, o script processa esses dados para criar duas visualizações distintas.

Visualização com Gráficos (Chart.js):

Gráfico de Pizza (Jogos por Gênero): O script analisa o array de jogos e conta dinamicamente quantas vezes cada genre (gênero) aparece. Esses dados são usados para gerar um gráfico de pizza, mostrando a distribuição percentual de cada gênero no catálogo de jogos.

Gráfico de Barras (Jogos por Ano de Lançamento): O script extrai o title (título) e o releaseYear (ano de lançamento) de cada jogo. Esses dados são usados para gerar um gráfico de barras horizontais, permitindo uma fácil comparação visual de quais jogos são os mais antigos e os mais novos.

### PRINT (GRAFICO)

![Print do Gráfico](PRINTgráficos.png)




