import React, { useState } from 'react';
import {
  Users,
  Search,
  Star,
  Plus,
  Upload,
  Download,
  Phone,
  Mail,
  MapPin,
  ExternalLink,
  Edit2,
  Trash2,
  X,
  RotateCcw,
  Check,
  FileSpreadsheet
} from 'lucide-react';
import { Contact } from '../types';
import { NESRIN_OUIS_CONTACT } from '../data/initialData';

interface Props {
  contacts: Contact[];
  isFrench: boolean;
  onAddContact: (contact: Omit<Contact, 'id' | 'createdAt'>) => void;
  onUpdateContact: (contact: Contact) => void;
  onDeleteContact: (contact: Contact) => void;
  onToggleStarred: (contact: Contact) => void;
  onImportCsv: (csvText: string) => void;
  onRestoreDefault: () => void;
}

export const ContactsScreen: React.FC<Props> = ({
  contacts,
  isFrench,
  onAddContact,
  onUpdateContact,
  onDeleteContact,
  onToggleStarred,
  onImportCsv,
  onRestoreDefault
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [starredOnly, setStarredOnly] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [isCsvModalOpen, setIsCsvModalOpen] = useState(false);
  const [csvInput, setCsvInput] = useState('');

  // Contact form state
  const [formFirstName, setFormFirstName] = useState('');
  const [formLastName, setFormLastName] = useState('');
  const [formOrg, setFormOrg] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formAddress, setFormAddress] = useState('');
  const [formNotes, setFormNotes] = useState('');
  const [formProfileUrl, setFormProfileUrl] = useState('');
  const [formIsStarred, setFormIsStarred] = useState(false);

  const openAddModal = () => {
    setEditingContact(null);
    setFormFirstName('');
    setFormLastName('');
    setFormOrg('');
    setFormPhone('');
    setFormEmail('');
    setFormAddress('');
    setFormNotes('');
    setFormProfileUrl('');
    setFormIsStarred(false);
    setIsAddModalOpen(true);
  };

  const openEditModal = (c: Contact) => {
    setEditingContact(c);
    setFormFirstName(c.firstName);
    setFormLastName(c.lastName);
    setFormOrg(c.organization);
    setFormPhone(c.phoneNumber);
    setFormEmail(c.email);
    setFormAddress(c.addressFormatted);
    setFormNotes(c.notes);
    setFormProfileUrl(c.profileUrl);
    setFormIsStarred(c.isStarred);
    setIsAddModalOpen(true);
  };

  const handleSaveContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formFirstName && !formLastName && !formOrg && !formPhone) return;

    if (editingContact) {
      onUpdateContact({
        ...editingContact,
        firstName: formFirstName,
        lastName: formLastName,
        organization: formOrg,
        phoneNumber: formPhone,
        email: formEmail,
        addressFormatted: formAddress,
        notes: formNotes,
        profileUrl: formProfileUrl,
        isStarred: formIsStarred
      });
    } else {
      onAddContact({
        firstName: formFirstName,
        lastName: formLastName,
        organization: formOrg,
        phoneNumber: formPhone,
        phoneLabel: 'Mobile',
        email: formEmail,
        addressFormatted: formAddress,
        street: '',
        city: '',
        region: '',
        postalCode: '',
        country: '',
        extendedAddress: '',
        notes: formNotes,
        profileUrl: formProfileUrl,
        labels: formIsStarred ? '* myContacts ::: * starred' : '* myContacts',
        isStarred: formIsStarred
      });
    }

    setIsAddModalOpen(false);
  };

  const handleCsvSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (csvInput.trim()) {
      onImportCsv(csvInput);
      setCsvInput('');
      setIsCsvModalOpen(false);
    }
  };

  const filteredContacts = contacts.filter((c) => {
    if (starredOnly && !c.isStarred) return false;
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    const fullName = `${c.firstName} ${c.lastName}`.toLowerCase();
    return (
      fullName.includes(q) ||
      c.phoneNumber.toLowerCase().includes(q) ||
      c.organization.toLowerCase().includes(q) ||
      c.addressFormatted.toLowerCase().includes(q) ||
      c.notes.toLowerCase().includes(q)
    );
  });

  const getInitials = (c: Contact) => {
    const f = c.firstName?.[0] || '';
    const l = c.lastName?.[0] || c.organization?.[0] || '';
    return (f + l).toUpperCase() || 'CT';
  };

  return (
    <div className="space-y-4 pb-16">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <Users className="w-5 h-5 text-emerald-400" />
            <span>{isFrench ? 'Contacts & Destinataires' : 'Contacts & Recipients'}</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 font-mono">
              {contacts.length}
            </span>
          </h2>
          <p className="text-xs text-slate-400">
            {isFrench
              ? 'Répertoire officiel Google Contacts et cibles de transmission'
              : 'Google Contacts directory and transmission targets'}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={onRestoreDefault}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            title="Restaurer Nesrin Ouis"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{isFrench ? 'Restaurer Nesrin' : 'Restore Nesrin'}</span>
          </button>

          <button
            onClick={() => setIsCsvModalOpen(true)}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
            <span>{isFrench ? 'Importer CSV' : 'Import CSV'}</span>
          </button>

          <button
            onClick={openAddModal}
            className="px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 shadow-md shadow-emerald-500/20 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>{isFrench ? 'Nouveau' : 'Add Contact'}</span>
          </button>
        </div>
      </div>

      {/* Search & Starred Filter Bar */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={isFrench ? 'Rechercher par nom, téléphone, ville...' : 'Search contacts by name, phone...'}
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
          />
        </div>

        <button
          onClick={() => setStarredOnly(!starredOnly)}
          className={`p-2 rounded-xl border flex items-center gap-1.5 text-xs font-semibold transition-colors ${
            starredOnly
              ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
              : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
          }`}
          title={isFrench ? 'Favoris uniquement' : 'Starred only'}
        >
          <Star className={`w-4 h-4 ${starredOnly ? 'fill-current' : ''}`} />
          <span className="hidden sm:inline">
            {isFrench ? 'Favoris' : 'Starred'}
          </span>
        </button>
      </div>

      {/* Contacts List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {filteredContacts.map((contact) => {
          const displayName =
            contact.firstName || contact.lastName
              ? `${contact.firstName} ${contact.lastName}`.trim()
              : contact.organization || contact.phoneNumber || 'Contact';

          return (
            <div
              key={contact.id}
              className="p-4 rounded-2xl border border-slate-800 bg-slate-900/60 hover:border-slate-700 flex flex-col justify-between gap-3 transition-all group"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white font-bold flex items-center justify-center shrink-0 shadow-md shadow-emerald-950">
                    {getInitials(contact)}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-slate-100 text-sm truncate">
                        {displayName}
                      </h3>
                      {contact.isStarred && (
                        <Star className="w-3.5 h-3.5 text-amber-400 fill-current shrink-0" />
                      )}
                    </div>
                    {contact.organization && (
                      <p className="text-xs text-slate-400 truncate">
                        {contact.organization}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onToggleStarred(contact)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-amber-400 transition-colors"
                  >
                    <Star
                      className={`w-4 h-4 ${
                        contact.isStarred ? 'fill-amber-400 text-amber-400' : ''
                      }`}
                    />
                  </button>
                  <button
                    onClick={() => openEditModal(contact)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-slate-200 transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDeleteContact(contact)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Contact Details Fields */}
              <div className="space-y-1.5 text-xs text-slate-300">
                {contact.phoneNumber && (
                  <div className="flex items-center justify-between font-mono">
                    <span className="flex items-center gap-2 text-slate-400">
                      <Phone className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-slate-200">{contact.phoneNumber}</span>
                    </span>
                    <a
                      href={`tel:${contact.phoneNumber}`}
                      className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 text-[11px]"
                    >
                      {isFrench ? 'Appeler' : 'Call'}
                    </a>
                  </div>
                )}

                {contact.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                    <span className="truncate">{contact.email}</span>
                  </div>
                )}

                {contact.addressFormatted && (
                  <div className="flex items-start gap-2 text-slate-400">
                    <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                    <span className="line-clamp-2 text-[11px]">
                      {contact.addressFormatted}
                    </span>
                  </div>
                )}

                {contact.profileUrl && (
                  <div className="pt-1">
                    <a
                      href={contact.profileUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-emerald-400 hover:underline flex items-center gap-1 font-mono"
                    >
                      <span>Profil CanadaPages</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit Contact Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-lg rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-100 text-base">
                {editingContact
                  ? isFrench ? 'Modifier le Contact' : 'Edit Contact'
                  : isFrench ? 'Ajouter un Contact' : 'New Contact'}
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveContact} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder={isFrench ? 'Prénom' : 'First Name'}
                  value={formFirstName}
                  onChange={(e) => setFormFirstName(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100"
                />
                <input
                  type="text"
                  placeholder={isFrench ? 'Nom' : 'Last Name'}
                  value={formLastName}
                  onChange={(e) => setFormLastName(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100"
                />
              </div>

              <input
                type="text"
                placeholder={isFrench ? 'Organisation / Entreprise' : 'Organization'}
                value={formOrg}
                onChange={(e) => setFormOrg(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100"
              />

              <div className="grid grid-cols-2 gap-2">
                <input
                  type="tel"
                  placeholder={isFrench ? 'Numéro de téléphone' : 'Phone Number'}
                  value={formPhone}
                  onChange={(e) => setFormPhone(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 font-mono"
                />
                <input
                  type="email"
                  placeholder={isFrench ? 'Email' : 'Email Address'}
                  value={formEmail}
                  onChange={(e) => setFormEmail(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100"
                />
              </div>

              <input
                type="text"
                placeholder={isFrench ? 'Adresse complète' : 'Full Address'}
                value={formAddress}
                onChange={(e) => setFormAddress(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100"
              />

              <input
                type="url"
                placeholder={isFrench ? 'Lien de profil web' : 'Web Profile URL'}
                value={formProfileUrl}
                onChange={(e) => setFormProfileUrl(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100"
              />

              <textarea
                placeholder={isFrench ? 'Notes...' : 'Notes...'}
                value={formNotes}
                onChange={(e) => setFormNotes(e.target.value)}
                rows={2}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100"
              />

              <label className="flex items-center gap-2 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={formIsStarred}
                  onChange={(e) => setFormIsStarred(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-700 text-amber-500 bg-slate-800"
                />
                <span className="text-slate-300">
                  {isFrench ? 'Marquer comme favori (Starred)' : 'Mark as starred'}
                </span>
              </label>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-semibold"
                >
                  {isFrench ? 'Annuler' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold"
                >
                  {isFrench ? 'Enregistrer' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CSV Import Modal */}
      {isCsvModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-xl rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-100 text-base flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-emerald-400" />
                <span>{isFrench ? 'Importer Google Contacts CSV' : 'Import Google Contacts CSV'}</span>
              </h3>
              <button
                onClick={() => setIsCsvModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-400">
              {isFrench
                ? 'Collez le contenu d\'un fichier CSV exporté depuis Google Contacts :'
                : 'Paste the contents of a CSV file exported from Google Contacts :'}
            </p>

            <form onSubmit={handleCsvSubmit} className="space-y-3">
              <textarea
                value={csvInput}
                onChange={(e) => setCsvInput(e.target.value)}
                placeholder="First Name,Last Name,Organization Name,Phone 1 - Value..."
                rows={6}
                className="w-full p-3 rounded-2xl bg-slate-950 border border-slate-800 font-mono text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
              />

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsCsvModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
                >
                  {isFrench ? 'Annuler' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold"
                >
                  {isFrench ? 'Importer les contacts' : 'Import contacts'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
