"use client";

import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
    fr: {
        common: {
            // ── Génériques ──────────────────────────────────────────────────────
            filters: "Filtres",
            filter: "Filtrer",
            logout: "Déconnexion",
            retry: "Réessayer",
            sort_by: "Trier par",
            actions: "Actions",
            profile: "Profil",
            back_to_home: "Accueil",
            upload: "Importer",
            search: "Rechercher",
            loading: "Chargement...",
            no_data: "Aucun résultat trouvé.",
            active: "Actif",
            inactive: "Inactif",
            yes: "Oui",
            no: "Non",
            cancel: "Annuler",
            submit: "Soumettre",
            processing: "Traitement en cours...",
            close: "Fermer",
            other: "Autre",
            fill_please: "Veuillez préciser",

            // ── Boutons ──────────────────────────────────────────────────────────
            button: {
                close: "Fermer",
                cancel: "Annuler",
                confirm: "Confirmer",
                add: "Ajouter",
                edit: "Modifier",
                delete: "Supprimer",
                save: "Enregistrer",
                send: "Envoyer",
                reset: "Réinitialiser",
                details: "Détails",
                export: "Exporter",
                download: "Télécharger",
                back: "Retour",
                accept: "Accepter",
                refuse: "Refuser",
                ascending_order: "Ordre croissant",
                descending_order: "Ordre décroissant",
            },

            // ── Pagination ────────────────────────────────────────────────────────
            pagination: {
                rows_per_page: "Lignes par page",
                of: "de",
            },

            // ── Confirmation ──────────────────────────────────────────────────────
            confirmation: {
                deletion_title: "Confirmer la suppression",
                deletion_message: "Voulez-vous vraiment supprimer {{label}} ? Cette action est irréversible.",
            },

            // ── Menu ──────────────────────────────────────────────────────────────
            menu: {
                dashboard: "Tableau de bord",
                reservations: "Réservations",
                rooms: "Salles",
                equipment: "Équipements",
                statistics: "Statistiques",
                administration: "Administration",
            },

            // ── Salles ────────────────────────────────────────────────────────────
            room: {
                title: "Gestion des Salles",
                search_placeholder: "Chercher une salle...",
                add_title: "Ajouter une salle",
                edit_title: "Modifier la salle",
                column: {
                    name: "Nom",
                    capacity: "Capacité",
                    type: "Type",
                    location: "Localisation",
                    building: "Bâtiment",
                    status: "Statut",
                    actions: "Actions",
                },
                form: {
                    name: "Nom",
                    capacity: "Capacité",
                    type: "Type",
                    building: "Bâtiment",
                    location: "Localisation",
                    status: "Statut",
                },
                status: {
                    active: "Active",
                    inactive: "Inactive",
                },
                type: {
                    CONFERENCE: "Conférence",
                    REUNION: "Réunion",
                    SALLE_CONSEIL: "Salle Conseil",
                    SALON: "Salon",
                    FORMATION: "Formation",
                    EXECUTIF: "Exécutif",
                },
                add_success: "Salle ajoutée avec succès.",
                edit_success: "Salle modifiée avec succès.",
                delete_success: "Salle supprimée avec succès.",
                delete_error: "Impossible de supprimer cette salle.",
                toggle_success: "Statut de la salle mis à jour.",
                not_found: "Aucune salle trouvée.",
                stats: {
                    total: "Salles totales",
                    active: "Salles actives",
                    inactive: "Salles inactives",
                },
            },

            // ── Équipements ───────────────────────────────────────────────────────
            equipement: {
                title: "Gestion des Équipements",
                search_placeholder: "Chercher un équipement...",
                add_title: "Ajouter un équipement",
                edit_title: "Modifier l'équipement",
                select_room: "Choisissez une salle pour voir ou gérer ses équipements :",
                back_to_rooms: "← Toutes les salles",
                column: {
                    name: "Nom",
                    type: "Type",
                    quantity: "Quantité",
                    room: "Salle assignée",
                    actions: "Actions",
                },
                form: {
                    name: "Nom",
                    type: "Type",
                    quantity: "Quantité",
                },
                type: {
                    PROJECTEUR: "Projecteur",
                    CLIMPROJECTEUR: "Clim + Projecteur",
                    CLIMATISATION: "Climatisation",
                    TABLEAU_BLANC: "Tableau Blanc",
                    TELEVISEUR: "Téléviseur",
                    SYSTEME_AUDIO: "Système Audio",
                    VISIOCONFERENCE: "Visioconférence",
                    IMPRIMANTEATISATION: "Imprimante",
                },
                add_success: "Équipement ajouté avec succès.",
                edit_success: "Équipement modifié avec succès.",
                delete_success: "Équipement supprimé avec succès.",
                delete_error: "Impossible de supprimer cet équipement.",
                not_found: "Aucun équipement pour cette salle.",
                not_assigned: "Non assigné",
                count_one: "{{count}} équipement",
                count_other: "{{count}} équipements",
            },

            // ── Réservations ──────────────────────────────────────────────────────
            reservation: {
                title: "Réservations",
                search_placeholder: "Chercher une réservation...",
                add_title: "Nouvelle réservation",
                edit_title: "Modifier la réservation",
                column: {
                    room: "Salle",
                    date: "Date",
                    start: "Début",
                    end: "Fin",
                    organizer: "Organisateur",
                    status: "Statut",
                    actions: "Actions",
                },
                form: {
                    room: "Salle",
                    date: "Date",
                    start_time: "Heure de début",
                    end_time: "Heure de fin",
                    title: "Objet",
                    description: "Description",
                    attendees: "Participants",
                },
                status: {
                    PENDING: "En attente",
                    CONFIRMED: "Confirmée",
                    CANCELLED: "Annulée",
                    REJECTED: "Refusée",
                },
                add_success: "Réservation créée avec succès.",
                edit_success: "Réservation modifiée avec succès.",
                delete_success: "Réservation supprimée avec succès.",
                confirm_success: "Réservation confirmée.",
                cancel_success: "Réservation annulée.",
                not_found: "Aucune réservation trouvée.",
            },

            // ── Administration ────────────────────────────────────────────────────
            administration: {
                title: "Administration",
                tabs: {
                    rooms: "Salles",
                    equipements: "Équipements",
                },
            },

            // ── Erreurs ────────────────────────────────────────────────────────────
            error: {
                generic: "Une erreur est survenue. Veuillez réessayer.",
                unauthorized: "Vous n'êtes pas autorisé à effectuer cette action.",
                not_found: "Ressource introuvable.",
                network: "Erreur réseau. Vérifiez votre connexion.",
                required: "Ce champ est obligatoire.",
            },
        },
    },
};

i18n.use(initReactI18next).init({
    resources,
    lng: "fr",
    fallbackLng: "fr",
    defaultNS: "common",
    interpolation: {
        escapeValue: false,
    },
});

export default i18n;
