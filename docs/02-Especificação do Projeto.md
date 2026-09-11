# Especificações do Projeto

## Histórias de Usuários

Com base na análise das personas forma identificadas as seguintes histórias de usuários:

|EU COMO... `PERSONA`| QUERO/PRECISO ... `FUNCIONALIDADE` |PARA ... `MOTIVO/VALOR`                 |
|--------------------|------------------------------------|----------------------------------------|
|Ana Clara  | Uma forma de identificar se uma agência é realmente confiável           | Me sentir mais segura ao contratar seus serviços               |
|Ana Clara       | Ter um mecanismo eficiente e rápido de comunicação                 | Que eu possa sanar todas as minhas dúvidas rapidamente |

Apresente aqui as histórias de usuário que são relevantes para o projeto de sua solução. As Histórias de Usuário consistem em uma ferramenta poderosa para a compreensão e elicitação dos requisitos funcionais e não funcionais da sua aplicação. Se possível, agrupe as histórias de usuário por contexto, para facilitar consultas recorrentes à essa parte do documento.

> **Links Úteis**:
> - [Histórias de usuários com exemplos e template](https://www.atlassian.com/br/agile/project-management/user-stories)
> - [Como escrever boas histórias de usuário (User Stories)](https://medium.com/vertice/como-escrever-boas-users-stories-hist%C3%B3rias-de-usu%C3%A1rios-b29c75043fac)
> - [User Stories: requisitos que humanos entendem](https://www.luiztools.com.br/post/user-stories-descricao-de-requisitos-que-humanos-entendem/)
> - [Histórias de Usuários: mais exemplos](https://www.reqview.com/doc/user-stories-example.html)
> - [9 Common User Story Mistakes](https://airfocus.com/blog/user-story-mistakes/)

## Requisitos

As tabelas que se seguem apresentam os requisitos funcionais e não funcionais que detalham o escopo do projeto.

### Requisitos Funcionais

|ID    | Descrição do Requisito  | Prioridade |
|------|-----------------------------------------|----|
| RF-001 | A aplicação deve permitir que o dono da barbearia crie uma conta no sistema. | ALTA |
| RF-002 | A aplicação deve permitir que o dono da barbearia realize login no sistema. | ALTA |
| RF-003 | A aplicação deve permitir que o dono da barbearia cadastre, edite e remova barbeiros vinculados ao seu estabelecimento. | ALTA |
| RF-004 | A aplicação deve permitir que o dono da barbearia cadastre os serviços oferecidos pelo estabelecimento, informando nome, descrição, duração e valor. | ALTA |
| RF-005 | A aplicação deve permitir que o dono da barbearia configure os horários disponíveis para agendamento, considerando o dia da semana e o barbeiro. | ALTA |
| RF-006 | A aplicação deve permitir que o dono da barbearia cadastre e edite informações sobre o estabelecimento, como nome, endereço, telefone, descrição e imagem. | MÉDIA |
| RF-007 | A aplicação deve permitir que o dono da barbearia consulte os agendamentos realizados em seu estabelecimento. | ALTA |
| RF-008 | A aplicação deve permitir que o dono da barbearia confirme, cancele ou conclua um agendamento. | ALTA |
| RF-009 | A aplicação deve permitir que o cliente crie uma conta no sistema. | ALTA |
| RF-010 | A aplicação deve permitir que o cliente realize login no sistema. | ALTA |
| RF-011 | A aplicação deve permitir que o cliente consulte as barbearias cadastradas e suas respectivas informações e serviços. | ALTA |
| RF-012 | A aplicação deve permitir que o cliente consulte os dias e horários disponíveis para determinado serviço e barbeiro. | ALTA |
| RF-013 | A aplicação deve permitir que o cliente selecione a barbearia, serviço, barbeiro, dia e horário para realizar um agendamento. | ALTA |
| RF-014 | A aplicação deve permitir que o cliente consulte seus agendamentos, incluindo serviço, barbeiro, data, horário e status. | ALTA |
| RF-015 | A aplicação deve permitir que o cliente cancele um agendamento de acordo com as condições estabelecidas pela barbearia. | MÉDIA |
| RF-016 | A aplicação deve enviar e-mails ao cliente com informações e atualizações relacionadas aos seus agendamentos. | MÉDIA |
| RF-017 | A aplicação deve permitir que o cliente e o dono da barbearia visualizem e editem suas próprias informações de perfil. | MÉDIA |
| RF-018 | A aplicação deve impedir que dois clientes realizem agendamentos para o mesmo barbeiro no mesmo horário. | ALTA |
| RF-019 | A aplicação deve permitir que o cliente e o dono da barbearia consultem o histórico de agendamentos realizados. | MÉDIA |

### Requisitos não Funcionais

|ID     | Descrição do Requisito  |Prioridade |
|-------|-------------------------|----|
| RNF-001 | A aplicação deve possuir uma interface intuitiva, simples e de fácil utilização, permitindo que os usuários realizem suas principais tarefas sem necessidade de conhecimentos técnicos. |
| RNF-002 | A aplicação deve carregar suas telas e funcionalidades principais em até 5 segundos em condições normais de uso. |
| RNF-003 | A aplicação deve garantir a integridade dos dados dos usuários e impedir acessos ou alterações não autorizadas às informações. |
| RNF-004 | A aplicação deve possuir uma interface responsiva, adaptando-se adequadamente a diferentes tamanhos de tela e dispositivos. |
| RNF-005 | A aplicação deve apresentar mensagens claras ao usuário em situações de erro, confirmação ou conclusão de operações. |
| RNF-006 | A aplicação deve manter um padrão visual consistente entre suas telas, incluindo elementos como botões, formulários, menus e navegação. |
| RNF-007 | A aplicação deve validar os dados informados pelos usuários antes de realizar operações como cadastro, login e agendamento. |

## Diagrama de Casos de Uso

O diagrama de casos de uso é o próximo passo após a elicitação de requisitos, que utiliza um modelo gráfico e uma tabela com as descrições sucintas dos casos de uso e dos atores. Ele contempla a fronteira do sistema e o detalhamento dos requisitos funcionais com a indicação dos atores, casos de uso e seus relacionamentos. 

As referências abaixo irão auxiliá-lo na geração do artefato “Diagrama de Casos de Uso”.
