trigger OpportunityBeforeUpdateTrigger on Opportunity (before update) {
    
    for (Opportunity opp : Trigger.new) {
        Opportunity oldOpp = Trigger.oldMap.get(opp.Id);
        
        // Verifica se o status (StageName) foi alterado
        if (opp.StageName != oldOpp.StageName) {
            // Armazena o status anterior no campo Status_Anterior__c
            opp.Status_Anterior_oportunidade__c = oldOpp.StageName;
        }
        
        if (opp.StageName == 'Negociação' && oldOpp.StageName != 'Negociação') {
            if (opp.Codigo_do_Projeto__c == null || opp.Codigo_do_Projeto__c == '') {
                opp.Codigo_do_Projeto__c.addError('O código do projeto não pode estar vazio se a fase da oportunidade for Negociação.');
            }
        }
        
    }
}