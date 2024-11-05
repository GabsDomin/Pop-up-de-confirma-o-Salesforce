@isTest
public class OpportunityBeforeUpdateTriggerTest {
    @isTest
    static void testStatusAnterior() {
        // Cria uma Opportunity de teste
        Opportunity opp = new Opportunity(
            Name = 'Teste Opportunity',
            StageName = 'Prospecting', // Estado inicial
            CloseDate = Date.today().addDays(30)
        );
        insert opp;

        // Atualiza o status da Opportunity
        opp.StageName = 'Negotiation/Review'; // Novo status
        update opp;

        // Verifica se o Status_Anterior__c foi preenchido corretamente
        Opportunity updatedOpp = [SELECT Status_Anterior_oportunidade__c FROM Opportunity WHERE Id = :opp.Id];
        System.assertEquals('Prospecting', updatedOpp.Status_Anterior_oportunidade__c);
    }
}