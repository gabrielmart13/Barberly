# Arquitetura da Solução

## Diagrama de Classes

<img width="1395" height="1127" alt="Diagrama de Classe - BARBERLY" src="https://github.com/user-attachments/assets/a7d010d1-0510-4a52-b7a6-da2a5cd9c6f7" />

## Modelo ER (Projeto Conceitual)

<img width="1536" height="1024" alt="Diagrama ER - BARBERLY" src="https://github.com/user-attachments/assets/c0b65313-e642-496c-bbc0-048a8abb18f5" />

## Projeto da Base de Dados

Projeto da Base de Dados

DONOBARBEARIA( idDonoBarbearia INT PK, nome VARCHAR(100), email VARCHAR(100), senha VARCHAR(255), contato VARCHAR(20) )

BARBEARIA( idBarbearia INT PK, nome VARCHAR(100), endereco VARCHAR(200), contato VARCHAR(20), descricao VARCHAR(200), idDonoBarbearia INT FK → DONOBARBEARIA(idDonoBarbearia) )

USUARIO( idUsuario INT PK, nome VARCHAR(100), email VARCHAR(100), senha VARCHAR(255), contato VARCHAR(20) )

BARBEIRO( idBarbeiro INT PK, nome VARCHAR(100), email VARCHAR(100), contato VARCHAR(20), experiencia VARCHAR(100), idBarbearia INT FK → BARBEARIA(idBarbearia) )

CATEGORIASERVICO( idCategoria INT PK, nome VARCHAR(50), descricao VARCHAR(200) )

SERVICO( idServico INT PK, nome VARCHAR(100), valor DECIMAL(10,2), tempoEstimado INT, idCategoria INT FK → CATEGORIASERVICO(idCategoria), idBarbearia INT FK → BARBEARIA(idBarbearia) )

HORARIOFUNCIONAMENTO( idHorario INT PK, diaSemana VARCHAR(20), horaAbertura TIME, horaFechamento TIME, idBarbearia INT FK → BARBEARIA(idBarbearia) )

AGENDAMENTO( idAgendamento INT PK, dataHora DATETIME, status VARCHAR(20), idUsuario INT FK → USUARIO(idUsuario), idServico INT FK → SERVICO(idServico), idBarbeiro INT FK → BARBEIRO(idBarbeiro), idBarbearia INT FK → BARBEARIA(idBarbearia) )

AVALIACAO( idAvaliacao INT PK, nota INT, comentario VARCHAR(200), dataAvaliacao DATETIME, idUsuario INT FK → USUARIO(idUsuario), idAgendamento INT FK → AGENDAMENTO(idAgendamento) )

## ATENÇÃO!!!

Os três artefatos — **Diagrama de Classes, Modelo ER e Projeto da Base de Dados** — devem ser desenvolvidos de forma sequencial e integrada, garantindo total coerência e compatibilidade entre eles. O diagrama de classes orienta a estrutura e o comportamento do software; o modelo ER traduz essa estrutura para o nível conceitual dos dados; e o projeto da base de dados materializa essas definições no formato físico (tabelas, colunas, chaves e restrições). A construção isolada ou desconexa desses elementos pode gerar inconsistências, dificultar a implementação e comprometer a qualidade do sistema.

## Tecnologias Utilizadas

Descreva aqui qual(is) tecnologias você vai usar para resolver o seu problema, ou seja, implementar a sua solução. Liste todas as tecnologias envolvidas, linguagens a serem utilizadas, serviços web, frameworks, bibliotecas, IDEs de desenvolvimento, e ferramentas.

Apresente também uma figura explicando como as tecnologias estão relacionadas ou como uma interação do usuário com o sistema vai ser conduzida, por onde ela passa até retornar uma resposta ao usuário.

## Hospedagem

Explique como a hospedagem e o lançamento da plataforma foi feita.

> **Links Úteis**:
>
> - [Website com GitHub Pages](https://pages.github.com/)
> - [Programação colaborativa com Repl.it](https://repl.it/)
> - [Getting Started with Heroku](https://devcenter.heroku.com/start)
> - [Publicando Seu Site No Heroku](http://pythonclub.com.br/publicando-seu-hello-world-no-heroku.html)
