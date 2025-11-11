/**
 * @NApiVersion 2.1
 * @NScriptType ClientScript
 */

/************************************************************************************************ 
 *  
 * OTP-9610 : Search through the database to find the matching blood donors Client Script
 * 
 ************************************************************************************************* 
 * 
 * Author: Jobin and Jismi IT Services 
 * 
 * Date Created : 23-October-2025 
 * 
 * Description : Client Script validates blood group and donation date fields before submission helps to
 * load blood donor details retrieved from search form and Ensures both fields are filled and the donation 
 * date is at least 90 days old and not in the future.
 * 
 * REVISION HISTORY
 *
 * @version 1.0 : 23-October-2025 : Initial version by JJ0417
 * 
 *************************************************************************************************/ 

define(['N/ui/dialog'], function (dialog) {

    /**
     * Executes on page load.
     * @param {Object} context - Script context.
     */
    function pageInit(context) {
        console.log('Client Script Loaded');
    }

    /**
     * Validates the donation date.
     * Ensures the date is not in the future and is at least 90 days old.
     *
     * @param {string|Date} donationDate - The selected donation date.
     * @returns {{valid: boolean, message?: string}} Validation result.
     */
    function validateDate(donationDate) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const selectedDate = new Date(donationDate);
        selectedDate.setHours(0, 0, 0, 0);

        if (selectedDate > today) {
            return { valid: false, message: 'Date cannot be in the future.' };
        }

        const diffDays = Math.floor((today - selectedDate) / (1000 * 60 * 60 * 24));

        if (diffDays < 90) {
            return {
                valid: false,
                message: 'Date must be at least 90 days ago.\nDays entered: ' + diffDays + ' days'
            };
        }

        return { valid: true };
    }

    /**
     * Validates required fields and donation date before record is saved.
     *
     * @param {Object} context - Save context.
     * @param {Record} context.currentRecord - Current record in the form.
     * @returns {boolean} Whether the record can be saved.
     */
    function saveRecord(context) {
        try {
            const record = context.currentRecord;

            const bloodGroup = record.getValue({ fieldId: 'custpage_blood_group' });
            const lastDonationDate = record.getValue({ fieldId: 'custpage_last_donation_date' });

            let missingFields = [];

            if (!bloodGroup) {
                missingFields.push('Blood Group');
            }

            if (!lastDonationDate) {
                missingFields.push('Last Donation Date');
            }

            if (missingFields.length > 0) {
                dialog.alert({
                    title: 'Missing Information',
                    message: 'Please enter: ' + missingFields.join(' and ')
                });
                return false;
            }

            const validation = validateDate(lastDonationDate);
            if (!validation.valid) {
                dialog.alert({ title: 'Validation Error', message: validation.message });
                return false;
            }

            return true;

        } catch (e) {
            console.error('Error in saveRecord', e.message);
            return false;
        }
    }

    return {
        pageInit: pageInit,
        saveRecord: saveRecord
    };
});
