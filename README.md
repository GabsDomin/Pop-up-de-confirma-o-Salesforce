# Pop-up-de-confirmacao-Salesforce
Implantei um pop-up em produção para atender ao pedido da minha cliente. A funcionalidade desejada é que, sempre que uma oportunidade seja definida com um status fechado, o sistema apresente um pop-up de confirmação, solicitando que o usuário confirme a alteração antes de concluir a mudança de status.


REQUISITOS:
É necessaria a criação do campo "Status_Anterior_oportunidade__c | Tipo: Texto" para que o gatilho registre o status anterior.
É opcional a criação do campo "Fechou_c | Tipo: Checkbox", na qual o Js o atualiza e ele serve para fazer um fluxo que bloquei atualizações depois da seleção da caixa.


