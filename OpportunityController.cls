public with sharing class OpportunityController {
    @AuraEnabled
    public static void updateOpportunityStatus(Id opportunityId, String newStatus) {
        Opportunity opp = [SELECT Id, Status_Anterior_oportunidade__c, StageName FROM Opportunity WHERE Id = :opportunityId LIMIT 1];
        if (newStatus != null) {
            opp.Status_Anterior_oportunidade__c = opp.StageName;
            opp.StageName = newStatus;
            update opp;
        }
    }
}
