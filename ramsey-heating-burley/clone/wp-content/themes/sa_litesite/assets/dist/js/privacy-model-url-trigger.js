/**
 * Privacy Modal Handler for Avada Theme with Fusion Builder
 * Handles opening the privacy modal when #privacy is in the URL
 */

(function() {
    'use strict';

    function openPrivacyModal() {
        // Try to find and click Fusion Modal trigger (to not intefere with JS functions)
        const fusionTriggers = [
            '.fusion-modal-text-link[href="#privacy"]',
            '.fusion-modal-text-link[data-toggle*="privacy"]',
            'a[data-toggle="modal"][href*="privacy"]',
            '.privacy-policy-link',
            'a[href="#privacy-modal"]',
            '.fusion-button[href="#privacy"]',
            'a.fusion-modal-text-link[href*="privacy"]',
            '[data-toggle="modal"][data-target*="privacy"]'
        ];

        for (let selector of fusionTriggers) {
            const trigger = document.querySelector(selector);
            if (trigger) {
                console.log('Found privacy trigger:', selector);
                trigger.click();
                return true;
            }
        }

        // Fallback: Use common modal() method if available
        const modalSelectors = [
            '.fusion-modal.privacy-modal',
            '.fusion-modal#privacy',
            '#privacy-modal',
            '.modal-privacy',
            '[data-modal-id="privacy"]'
        ];
        
        for (let selector of modalSelectors) {
            const modal = document.querySelector(selector);
            if (modal) {
                console.log('Found privacy modal:', selector);
                
                if (typeof jQuery !== 'undefined' && jQuery.fn.modal) {
                    jQuery(modal).modal('show');
                    return true;
                }
            }
        }

        const allModals = document.querySelectorAll('.fusion-modal, .modal');
        for (let modal of allModals) {
            const modalId = modal.getAttribute('id') || '';
            const modalClass = modal.className || '';
            const modalContent = modal.textContent.toLowerCase();
            
            if (modalId.includes('privacy') || modalClass.includes('privacy') || 
                (modalContent.includes('privacy policy') && modalContent.length < 5000)) {
                console.log('Found privacy modal by content search');
                
                if (typeof jQuery !== 'undefined' && jQuery.fn.modal) {
                    jQuery(modal).modal('show');
                    return true;
                }
            }
        }

        console.warn('Privacy modal not found. Please ensure the modal exists and update the selector.');
        return false;
    }

    function handlePrivacyHash() {
        const hash = window.location.hash;
        
        if (hash === '#privacy') {
            setTimeout(function() {
                const opened = openPrivacyModal();
                
                if (opened && history.replaceState) {
                    history.replaceState(null, null, window.location.pathname + window.location.search);
                }
            }, 300);
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', handlePrivacyHash);
    } else {
        handlePrivacyHash();
    }

    // listen for hash changes - incase anchor nav links in use 
    window.addEventListener('hashchange', handlePrivacyHash);

})();
