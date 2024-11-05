import { LightningElement, api, track, wire } from 'lwc';
import { getRecord, updateRecord } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

const FIELDS = ['Opportunity.StageName', 'Opportunity.Status_Anterior_oportunidade__c', 'Opportunity.Fechou__c'];

export default class OpportunityStatusConfirmation extends LightningElement {
    @api recordId;
    @track showModal = false;
    @track status;
    @track previousStatus;
    @track fechou; // Checkbox Fechou__c
    @track isInitialLoad = true; // Para rastrear se é o carregamento inicial

    @wire(getRecord, { recordId: '$recordId', fields: FIELDS })
    opportunity({ error, data }) {
        if (data) {
            const currentStatus = data.fields.StageName.value;
            const previousStatus = data.fields.Status_Anterior_oportunidade__c.value;
            this.fechou = data.fields.Fechou__c.value;

            // Se a checkbox "Fechou__c" estiver marcada, não faz nada
            if (this.fechou) {
                this.isInitialLoad = false;
                return;
            }

            // Atualiza o estado atual e o anterior
            this.status = currentStatus;
            this.previousStatus = previousStatus;

            // Se não for carregamento inicial e o status for 'Vencemos', 'Perdemos', ou 'Cancelado', exibe o modal
            if (!this.isInitialLoad && ['Vencemos', 'Homologado', 'Perdemos', 'Cancelada', 'Perdida', 'Fechado/Perdido', 'Fechado/Ganho'].includes(currentStatus)) {
                this.showModal = true;
            }

            // Marca que o carregamento inicial foi concluído
            this.isInitialLoad = false;
        } else if (error) {
            console.error(error);
        }
    }

    closeModal() {
        this.showModal = false;
    }

    handleCancel() {
        this.closeModal();
        this.revertStatus();
    }

    handleConfirm() {
        this.closeModal();
        this.markFechou(); // Marca a checkbox Fechou__c
    }

    updateStatus(newStatus) {
        const fields = {};
        fields.Id = this.recordId;
        fields.StageName = newStatus;
        const recordInput = { fields };

        updateRecord(recordInput)
            .then(() => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Success',
                        message: 'Status atualizado com sucesso.',
                        variant: 'success',
                    })
                );
                this.dispatchEvent(new CustomEvent('statusupdated'));
                // Marca como carregamento inicial novamente
                this.isInitialLoad = true;
            })
            .catch(error => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error',
                        message: error.body.message,
                        variant: 'error',
                    })
                );
            });
    }

    markFechou() {
        const fields = {};
        fields.Id = this.recordId;
        fields.Fechou__c = true; // Marca a checkbox Fechou__c
        const recordInput = { fields };

        updateRecord(recordInput)
            .then(() => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Success',
                        message: 'Fechou__c marcada com sucesso.',
                        variant: 'success',
                    })
                );
            })
            .catch(error => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error',
                        message: error.body.message,
                        variant: 'error',
                    })
                );
            });
    }

    revertStatus() {
        const fields = {};
        fields.Id = this.recordId;
        fields.StageName = this.previousStatus;
        const recordInput = { fields };

        updateRecord(recordInput)
            .then(() => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Revertido',
                        message: 'Status revertido com sucesso.',
                        variant: 'success',
                    })
                );
                this.dispatchEvent(new CustomEvent('statusreverted'));
                // Marca como carregamento inicial novamente
                this.isInitialLoad = true;
            })
            .catch(error => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error',
                        message: error.body.message,
                        variant: 'error',
                    })
                );
            });
    }
}