// @ts-nocheck
import { useState } from 'react';

const FRAIS_KOYA_PAR_PLACE = 1000;
const COMMISSION_RABATTEUR = 200;
const COMMISSION_VENDEUR = 100;

const DEMO_DEMANDES = [
  {
    id: 1,
    code: 'DEMANDE-KOYA-2804-042',
    client: 'Koné Aminata',
    tel: '+225 07 14 22 99',
    from: 'Abidjan',
    to: 'Bouaké',
    date: '2026-04-30',
    heure: '06h30',
    places: 2,
    prixTicket: 5000,
    montant: 12000,
    operateur: 'Orange Money',
    statut: 'en_attente',
    urgent: false,
    vendeur: null,
    rabatteur: 'Yao Serge',
    source: 'Rabatteur gare Adjamé',
    preuvePaiement: false,
    preuvePlace: false,
    notes: [],
    besoin: '',
    created: '08:14',
  },
  {
    id: 2,
    code: 'DEMANDE-KOYA-2804-043',
    client: 'Diabaté Moussa',
    tel: '+225 05 88 12 34',
    from: 'Abidjan',
    to: 'Yamoussoukro',
    date: '2026-04-28',
    heure: '07h00',
    places: 1,
    prixTicket: 3500,
    montant: 4500,
    operateur: 'Wave',
    statut: 'vendeur_contacte',
    urgent: true,
    vendeur: 'Kouamé Jean',
    rabatteur: 'Traoré Ali',
    source: 'File d’attente gare',
    preuvePaiement: false,
    preuvePlace: false,
    notes: ['Vendeur contacté à 08h22'],
    besoin: 'Voyage urgent',
    created: '08:21',
  },
  {
    id: 3,
    code: 'DEMANDE-KOYA-2804-044',
    client: 'Traoré Mariam',
    tel: '+225 01 22 44 55',
    from: 'Abidjan',
    to: 'Daloa',
    date: '2026-04-29',
    heure: '06h00',
    places: 3,
    prixTicket: 6000,
    montant: 21000,
    operateur: 'MTN Money',
    statut: 'place_confirmee',
    urgent: false,
    vendeur: 'Diallo Ibrahim',
    rabatteur: null,
    source: 'WhatsApp organique',
    preuvePaiement: false,
    preuvePlace: true,
    notes: ['Vendeur confirmé', 'Preuve photo reçue 08h45'],
    besoin: '3 bagages',
    created: '08:30',
  },
];

const VENDEURS = [
  { id: 1, nom: 'Kouamé Jean', gare: 'Adjamé', compagnie: 'AVS', actif: true },
  {
    id: 2,
    nom: 'Diallo Ibrahim',
    gare: 'Yopougon',
    compagnie: 'CTE',
    actif: true,
  },
  {
    id: 3,
    nom: 'Soro Mamadou',
    gare: 'Adjamé',
    compagnie: 'Malex',
    actif: false,
  },
];

const STATUTS = {
  en_attente: {
    label: 'En attente',
    color: '#E07B00',
    bg: '#FFF4E6',
    dot: '#E07B00',
  },
  vendeur_contacte: {
    label: 'Vendeur contacté',
    color: '#1B4F8A',
    bg: '#EBF2FA',
    dot: '#1B4F8A',
  },
  preuve_place: {
    label: 'Preuve reçue',
    color: '#1B4F8A',
    bg: '#EBF2FA',
    dot: '#1B4F8A',
  },
  place_confirmee: {
    label: 'Place confirmée',
    color: '#1A6B3A',
    bg: '#EAF7EE',
    dot: '#1A6B3A',
  },
  place_refusee: {
    label: 'Place refusée',
    color: '#C0392B',
    bg: '#FDF0EF',
    dot: '#C0392B',
  },
  paiement_recu: {
    label: 'Paiement reçu',
    color: '#7B2D8B',
    bg: '#F5E6FA',
    dot: '#7B2D8B',
  },
  code_envoye: {
    label: 'Code envoyé',
    color: '#1A6B3A',
    bg: '#EAF7EE',
    dot: '#1A6B3A',
  },
  voyage_confirme: {
    label: 'Voyagé ✅',
    color: '#0D5C2F',
    bg: '#D4EDDA',
    dot: '#0D5C2F',
  },
  probleme: {
    label: 'Problème ⚠️',
    color: '#C0392B',
    bg: '#FDF0EF',
    dot: '#C0392B',
  },
  rembourse: { label: 'Remboursé', color: '#555', bg: '#F0F0F0', dot: '#555' },
};

function calcFinance(d) {
  const fraisKoya = d.places * FRAIS_KOYA_PAR_PLACE;
  const commissionRabatteur = d.rabatteur ? d.places * COMMISSION_RABATTEUR : 0;
  const commissionVendeur = d.vendeur ? d.places * COMMISSION_VENDEUR : 0;
  const margeKoya = fraisKoya - commissionRabatteur - commissionVendeur;

  return {
    fraisKoya,
    commissionRabatteur,
    commissionVendeur,
    margeKoya,
  };
}

const css = `
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:wght@300;400;500;700&display=swap');

*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}

:root{
  --g:#1A5C38;
  --g2:#237A4B;
  --lg:#EAF7EE;
  --o:#E07B00;
  --lo:#FFF4E6;
  --b:#1B4F8A;
  --lb:#EBF2FA;
  --dk:#0D1B0F;
  --mid:#4A5568;
  --lite:#F7F9F7;
  --bd:#D4DDE0;
  --w:#FFFFFF;
  --r:#C0392B;
  --lr:#FDF0EF;
  --sh:0 1px 3px rgba(0,0,0,.08),0 4px 16px rgba(0,0,0,.06);
}

body{
  font-family:'DM Sans',sans-serif;
  background:var(--lite);
  color:var(--dk);
  min-height:100vh;
  font-size:14px;
}

.layout{display:flex;min-height:100vh}

.sidebar{
  width:220px;
  background:var(--dk);
  flex-shrink:0;
  position:fixed;
  top:0;
  left:0;
  height:100vh;
  z-index:100;
  display:flex;
  flex-direction:column;
}

.sidebar-logo{
  padding:20px 16px 16px;
  border-bottom:1px solid rgba(255,255,255,.08);
}

.logo-text{
  font-family:'Syne',sans-serif;
  font-size:22px;
  font-weight:800;
  color:#fff;
  letter-spacing:2px;
}

.logo-text span{color:var(--o)}

.logo-sub{
  font-size:10px;
  color:rgba(255,255,255,.4);
  letter-spacing:1px;
  margin-top:2px;
}

.sidebar-nav{padding:12px 0;flex:1}

.nav-item{
  display:flex;
  align-items:center;
  gap:10px;
  padding:9px 16px;
  font-size:13px;
  font-weight:500;
  color:rgba(255,255,255,.6);
  cursor:pointer;
  transition:all .15s;
  border-left:3px solid transparent;
}

.nav-item:hover{color:#fff;background:rgba(255,255,255,.05)}
.nav-item.active{color:#fff;background:rgba(255,255,255,.08);border-left-color:var(--o)}

.nav-icon{font-size:15px;width:18px;text-align:center}

.sidebar-footer{
  padding:12px 16px;
  border-top:1px solid rgba(255,255,255,.08);
}

.sidebar-user{font-size:11px;color:rgba(255,255,255,.4)}
.sidebar-name{color:rgba(255,255,255,.8);font-weight:500;font-size:12px}

.main{
  margin-left:220px;
  flex:1;
  display:flex;
  flex-direction:column;
}

.topbar{
  background:var(--w);
  border-bottom:1px solid var(--bd);
  padding:0 24px;
  height:56px;
  display:flex;
  align-items:center;
  justify-content:space-between;
  position:sticky;
  top:0;
  z-index:90;
}

.topbar-title{
  font-family:'Syne',sans-serif;
  font-size:16px;
  font-weight:700;
  color:var(--dk);
}

.topbar-right{display:flex;align-items:center;gap:12px}

.urg-badge{
  background:var(--lr);
  color:var(--r);
  font-size:11px;
  font-weight:700;
  padding:3px 8px;
  border-radius:20px;
  border:1px solid rgba(192,57,43,.2);
}

.content{padding:20px 24px;flex:1}

.kpi-grid{
  display:grid;
  grid-template-columns:repeat(5,1fr);
  gap:14px;
  margin-bottom:20px;
}

.kpi{
  background:var(--w);
  border-radius:12px;
  padding:16px;
  box-shadow:var(--sh);
  border:1px solid var(--bd);
}

.kpi-label{
  font-size:11px;
  color:var(--mid);
  font-weight:700;
  text-transform:uppercase;
  letter-spacing:.5px;
  margin-bottom:6px;
}

.kpi-val{
  font-family:'Syne',sans-serif;
  font-size:25px;
  font-weight:800;
  margin-bottom:2px;
}

.kpi-sub{font-size:11px;color:var(--mid)}

.table-wrap{
  background:var(--w);
  border-radius:12px;
  box-shadow:var(--sh);
  border:1px solid var(--bd);
  overflow:hidden;
}

.table-head-row{
  padding:14px 18px;
  border-bottom:1px solid var(--bd);
  display:flex;
  align-items:center;
  justify-content:space-between;
  flex-wrap:wrap;
  gap:10px;
}

.table-title{
  font-family:'Syne',sans-serif;
  font-size:14px;
  font-weight:700;
  color:var(--dk);
}

.filters{display:flex;gap:6px;flex-wrap:wrap}

.fbtn{
  font-size:11px;
  font-weight:500;
  padding:4px 10px;
  border-radius:6px;
  border:1px solid var(--bd);
  background:var(--w);
  cursor:pointer;
  color:var(--mid);
  transition:all .15s;
}

.fbtn.active{background:var(--g);color:#fff;border-color:var(--g)}

table{width:100%;border-collapse:collapse}

th{
  padding:10px 14px;
  text-align:left;
  font-size:11px;
  font-weight:700;
  color:var(--mid);
  text-transform:uppercase;
  letter-spacing:.5px;
  border-bottom:1px solid var(--bd);
  background:var(--lite);
}

td{
  padding:11px 14px;
  border-bottom:1px solid #F0F4F1;
  vertical-align:middle;
  font-size:13px;
}

tr:last-child td{border-bottom:none}
tr:hover td{background:#FAFCFA;cursor:pointer}

.urg{
  background:var(--lr);
  color:var(--r);
  font-size:10px;
  font-weight:700;
  padding:2px 5px;
  border-radius:4px;
  margin-left:5px;
}

.badge{
  display:inline-flex;
  align-items:center;
  gap:5px;
  font-size:11px;
  font-weight:700;
  padding:3px 8px;
  border-radius:20px;
}

.bdot{
  width:6px;
  height:6px;
  border-radius:50%;
  flex-shrink:0;
}

.proof-ok{color:var(--g);font-size:12px;font-weight:700}
.proof-no{color:var(--r);font-size:12px;font-weight:700}

.abtn{
  font-size:12px;
  font-weight:700;
  padding:6px 10px;
  border-radius:7px;
  border:1px solid var(--bd);
  background:var(--w);
  cursor:pointer;
  color:var(--mid);
  transition:all .15s;
  display:inline-flex;
  align-items:center;
  gap:4px;
}

.abtn:hover{background:var(--lite)}
.abtn.g{background:var(--lg);color:var(--g);border-color:rgba(26,92,56,.2)}
.abtn.r{background:var(--lr);color:var(--r);border-color:rgba(192,57,43,.2)}
.abtn.b{background:var(--lb);color:var(--b);border-color:rgba(27,79,138,.2)}
.abtn.o{background:var(--lo);color:var(--o);border-color:rgba(224,123,0,.2)}

.overlay{
  position:fixed;
  inset:0;
  background:rgba(0,0,0,.45);
  z-index:200;
  display:flex;
  align-items:flex-start;
  justify-content:flex-end;
}

.drawer{
  background:var(--w);
  width:500px;
  height:100vh;
  overflow-y:auto;
  box-shadow:-4px 0 24px rgba(0,0,0,.15);
  display:flex;
  flex-direction:column;
}

.dh{
  padding:18px 20px;
  border-bottom:1px solid var(--bd);
  display:flex;
  align-items:center;
  justify-content:space-between;
  position:sticky;
  top:0;
  background:var(--w);
  z-index:10;
}

.dh-title{
  font-family:'Syne',sans-serif;
  font-size:15px;
  font-weight:700;
  color:var(--dk);
}

.xbtn{
  width:28px;
  height:28px;
  border-radius:6px;
  border:1px solid var(--bd);
  background:var(--w);
  cursor:pointer;
  display:flex;
  align-items:center;
  justify-content:center;
  font-size:16px;
}

.db{padding:18px 20px;flex:1}
.ds{margin-bottom:16px}

.dl{
  font-size:11px;
  font-weight:700;
  color:var(--mid);
  text-transform:uppercase;
  letter-spacing:.5px;
  margin-bottom:7px;
}

.dr{
  display:flex;
  justify-content:space-between;
  gap:12px;
  padding:6px 0;
  border-bottom:1px solid #F0F4F1;
  font-size:13px;
}

.dr:last-child{border-bottom:none}

.dk2{color:var(--mid)}
.dv{font-weight:700;color:var(--dk);text-align:right}

.d-acts{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:12px}

.sel-v{
  width:100%;
  height:40px;
  padding:0 10px;
  border:1.5px solid var(--bd);
  border-radius:8px;
  font-size:13px;
  font-family:'DM Sans',sans-serif;
  color:var(--dk);
  background:var(--w);
  outline:none;
}

.sel-v:focus{border-color:var(--g)}

.ni{
  width:100%;
  border:1.5px solid var(--bd);
  border-radius:8px;
  padding:8px 10px;
  font-size:13px;
  font-family:'DM Sans',sans-serif;
  color:var(--dk);
  resize:none;
  height:68px;
  outline:none;
}

.ni:focus{border-color:var(--b)}

.note{
  background:var(--lite);
  border-radius:7px;
  padding:7px 10px;
  font-size:12px;
  color:var(--mid);
  margin-bottom:5px;
  border-left:3px solid var(--bd);
}

.sep{
  height:1px;
  background:var(--bd);
  margin:14px 0;
}

.alert{
  background:var(--lr);
  color:var(--r);
  border:1px solid rgba(192,57,43,.2);
  border-radius:8px;
  padding:10px 12px;
  font-size:12px;
  font-weight:700;
  margin-bottom:12px;
}

.success{
  background:var(--lg);
  color:var(--g);
  border:1px solid rgba(26,92,56,.2);
  border-radius:8px;
  padding:10px 12px;
  font-size:12px;
  font-weight:700;
  margin-bottom:12px;
}

.vwrap{
  min-height:100vh;
  background:linear-gradient(135deg,#0D3D24 0%,#1A5C38 100%);
  display:flex;
  align-items:center;
  justify-content:center;
  padding:20px;
}

.vcard{
  background:#fff;
  border-radius:20px;
  width:100%;
  max-width:380px;
  overflow:hidden;
  box-shadow:0 8px 32px rgba(0,0,0,.2);
}

.vhdr{background:var(--g);padding:18px;text-align:center}

.vlogo{
  font-family:'Syne',sans-serif;
  font-size:20px;
  font-weight:800;
  color:#fff;
  letter-spacing:2px;
}

.vlogo span{color:var(--o)}
.vsub{font-size:11px;color:rgba(255,255,255,.7);margin-top:3px}
.vbody{padding:18px}

.vbox{
  background:var(--lite);
  border-radius:12px;
  padding:13px;
  margin-bottom:14px;
}

.vcode{
  font-family:'Syne',sans-serif;
  font-size:12px;
  font-weight:700;
  color:var(--g);
  margin-bottom:9px;
}

.vrow{
  display:flex;
  justify-content:space-between;
  font-size:13px;
  margin-bottom:5px;
}

.vrow:last-child{margin-bottom:0}
.vk{color:var(--mid)}
.vv{font-weight:700;color:var(--dk)}

.vurg{
  background:var(--lr);
  color:var(--r);
  font-size:11px;
  font-weight:700;
  padding:5px 10px;
  border-radius:7px;
  text-align:center;
  margin-bottom:12px;
}

.vgrid{
  display:grid;
  grid-template-columns:1fr 1fr;
  gap:10px;
  margin-bottom:12px;
}

.vbtn{
  height:52px;
  border:none;
  border-radius:12px;
  font-family:'Syne',sans-serif;
  font-size:14px;
  font-weight:700;
  cursor:pointer;
  transition:all .2s;
  display:flex;
  align-items:center;
  justify-content:center;
  gap:6px;
}

.vbtn-y{background:var(--g);color:#fff;box-shadow:0 4px 12px rgba(26,92,56,.3)}
.vbtn-y:hover{background:var(--g2)}
.vbtn-n{background:var(--lr);color:var(--r);border:2px solid rgba(192,57,43,.2)}
.vbtn-n:hover{background:#FAD9D6}

.vbtn-f{
  grid-column:1/-1;
  background:var(--lb);
  color:var(--b);
  height:44px;
  border:none;
  border-radius:10px;
  font-family:'Syne',sans-serif;
  font-size:13px;
  font-weight:700;
  cursor:pointer;
}

.vup{
  border:2px dashed var(--bd);
  border-radius:10px;
  padding:16px;
  text-align:center;
  cursor:pointer;
  transition:all .2s;
  margin-bottom:12px;
  font-size:13px;
  color:var(--mid);
}

.vup:hover{border-color:var(--g);background:var(--lg);color:var(--g)}

.vdone{text-align:center;padding:20px 0}
.vdone-ico{font-size:44px;margin-bottom:10px}
.vdone-t{font-family:'Syne',sans-serif;font-size:17px;font-weight:700;color:var(--g);margin-bottom:5px}
.vdone-s{font-size:13px;color:var(--mid)}

@media(max-width:900px){
  .sidebar{display:none}
  .main{margin-left:0}
  .kpi-grid{grid-template-columns:1fr 1fr}
  .drawer{width:100%}
  table{font-size:12px}
}
`;

function Badge({ statut }) {
  const s = STATUTS[statut] || STATUTS.en_attente;
  return (
    <span className="badge" style={{ background: s.bg, color: s.color }}>
      <span className="bdot" style={{ background: s.dot }}></span>
      {s.label}
    </span>
  );
}

function VendeurUI({ demande, onBack }) {
  const [done, setDone] = useState(null);
  const [preuveEnvoyee, setPreuveEnvoyee] = useState(
    demande.preuvePlace || false
  );

  if (done) {
    const m = {
      oui: {
        ico: '✅',
        t: 'Place confirmée avec preuve',
        s: 'KOYA peut maintenant valider le client.',
      },
      non: { ico: '❌', t: 'Place refusée', s: 'KOYA a été notifié.' },
      photo: {
        ico: '📸',
        t: 'Preuve envoyée',
        s: 'Tu peux maintenant confirmer la place.',
      },
    }[done];

    return (
      <div className="vwrap">
        <div className="vcard">
          <div className="vhdr">
            <div className="vlogo">
              KOYA<span>.</span>
            </div>
            <div className="vsub">Interface Vendeur</div>
          </div>
          <div className="vbody">
            <div className="vdone">
              <div className="vdone-ico">{m.ico}</div>
              <div className="vdone-t">{m.t}</div>
              <div className="vdone-s">{m.s}</div>
            </div>
            <button
              className="vbtn-f vbtn"
              style={{ marginTop: 16 }}
              onClick={() => setDone(null)}
            >
              Retour
            </button>
          </div>
        </div>
      </div>
    );
  }

  function confirmerAvecPreuve() {
    if (!preuveEnvoyee) return;
    setDone('oui');
  }

  return (
    <div className="vwrap">
      <div className="vcard">
        <div className="vhdr">
          <div className="vlogo">
            KOYA<span>.</span>
          </div>
          <div className="vsub">Interface Vendeur Partenaire</div>
        </div>
        <div className="vbody">
          {demande.urgent && (
            <div className="vurg">⚠️ URGENT — Voyage aujourd'hui</div>
          )}

          <div className="vbox">
            <div className="vcode">{demande.code}</div>
            <div className="vrow">
              <span className="vk">Client</span>
              <span className="vv">{demande.client}</span>
            </div>
            <div className="vrow">
              <span className="vk">Trajet</span>
              <span className="vv">
                {demande.from} → {demande.to}
              </span>
            </div>
            <div className="vrow">
              <span className="vk">Date</span>
              <span className="vv">{demande.date}</span>
            </div>
            <div className="vrow">
              <span className="vk">Heure</span>
              <span className="vv">{demande.heure}</span>
            </div>
            <div className="vrow">
              <span className="vk">Places</span>
              <span className="vv">{demande.places}</span>
            </div>
            {demande.besoin && (
              <div className="vrow">
                <span className="vk">Besoin</span>
                <span className="vv" style={{ fontSize: 12 }}>
                  {demande.besoin}
                </span>
              </div>
            )}
          </div>

          {!preuveEnvoyee && (
            <div className="alert">
              ⚠️ Avant de confirmer, envoie une preuve : photo du ticket, cahier
              ou registre.
            </div>
          )}

          {preuveEnvoyee && (
            <div className="success">
              ✅ Preuve reçue. Tu peux confirmer la place.
            </div>
          )}

          <div
            className="vup"
            onClick={() => {
              setPreuveEnvoyee(true);
              setDone('photo');
            }}
          >
            📷 Envoyer photo preuve place
            <div style={{ fontSize: 11, marginTop: 4, color: '#999' }}>
              Ticket, cahier ou registre
            </div>
          </div>

          <div className="vgrid">
            <button
              className="vbtn vbtn-y"
              onClick={confirmerAvecPreuve}
              style={{ opacity: preuveEnvoyee ? 1 : 0.45 }}
            >
              ✅ Confirmer
            </button>
            <button className="vbtn vbtn-n" onClick={() => setDone('non')}>
              ❌ Refuser
            </button>
          </div>

          <div
            style={{
              marginTop: 14,
              padding: 10,
              background: 'var(--lite)',
              borderRadius: 9,
              fontSize: 11,
              color: 'var(--mid)',
            }}
          >
            🔒 Confirmation valide uniquement avec preuve.
          </div>

          <button
            onClick={onBack}
            style={{
              marginTop: 10,
              background: 'none',
              border: 'none',
              color: 'var(--mid)',
              fontSize: 12,
              cursor: 'pointer',
              width: '100%',
              textAlign: 'center',
            }}
          >
            ← Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}

function FicheDrawer({ demande, onClose, onUpdate }) {
  const [note, setNote] = useState('');
  const [vend, setVend] = useState(demande.vendeur || '');
  const finance = calcFinance(demande);

  function changeStatut(statut) {
    if (statut === 'place_confirmee' && !demande.preuvePlace) {
      onUpdate(demande.id, {
        notes: [
          ...demande.notes,
          'Tentative de confirmation bloquée : preuve place manquante.',
        ],
      });
      return;
    }

    if (statut === 'paiement_recu' && !demande.preuvePaiement) {
      onUpdate(demande.id, {
        notes: [
          ...demande.notes,
          'Paiement marqué reçu par opérateur. Preuve paiement à vérifier.',
        ],
        preuvePaiement: true,
        statut,
      });
      return;
    }

    onUpdate(demande.id, { statut });
  }

  function addNote() {
    if (!note.trim()) return;
    onUpdate(demande.id, { notes: [...demande.notes, note] });
    setNote('');
  }

  function assignV() {
    if (!vend) return;
    onUpdate(demande.id, {
      vendeur: vend,
      statut: 'vendeur_contacte',
      notes: [...demande.notes, `Assigné à ${vend}`],
    });
  }

  function marquerPreuvePlace() {
    onUpdate(demande.id, {
      preuvePlace: true,
      statut: 'preuve_place',
      notes: [...demande.notes, 'Preuve place reçue : ticket/cahier/registre.'],
    });
  }

  function marquerPreuvePaiement() {
    onUpdate(demande.id, {
      preuvePaiement: true,
      notes: [...demande.notes, 'Preuve paiement reçue et enregistrée.'],
    });
  }

  const acts = [
    {
      label: '📸 Preuve place reçue',
      st: 'preuve_place',
      cls: 'b',
      custom: marquerPreuvePlace,
      show: ['vendeur_contacte', 'en_attente'],
    },
    {
      label: '✅ Confirmer place',
      st: 'place_confirmee',
      cls: 'g',
      show: ['preuve_place', 'vendeur_contacte', 'en_attente'],
    },
    {
      label: '❌ Refuser',
      st: 'place_refusee',
      cls: 'r',
      show: ['vendeur_contacte', 'place_confirmee', 'preuve_place'],
    },
    {
      label: '📷 Preuve paiement',
      st: 'preuve_paiement',
      cls: 'o',
      custom: marquerPreuvePaiement,
      show: ['place_confirmee'],
    },
    {
      label: '💰 Paiement reçu',
      st: 'paiement_recu',
      cls: 'b',
      show: ['place_confirmee'],
    },
    {
      label: '🔑 Code envoyé',
      st: 'code_envoye',
      cls: '',
      show: ['paiement_recu'],
    },
    {
      label: '🚌 Voyagé',
      st: 'voyage_confirme',
      cls: 'g',
      show: ['code_envoye'],
    },
    {
      label: '⚠️ Problème',
      st: 'probleme',
      cls: 'r',
      show: ['place_confirmee', 'paiement_recu', 'code_envoye'],
    },
    {
      label: '💸 Remboursé',
      st: 'rembourse',
      cls: '',
      show: ['place_refusee', 'probleme'],
    },
  ];

  return (
    <div
      className="overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="drawer">
        <div className="dh">
          <div>
            <div className="dh-title">{demande.code}</div>
            {demande.urgent && <span className="urg">URGENT</span>}
          </div>
          <button className="xbtn" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="db">
          <div className="ds">
            <div className="dl">Statut</div>
            <Badge statut={demande.statut} />
          </div>

          {!demande.preuvePlace &&
            ['vendeur_contacte', 'preuve_place'].includes(demande.statut) && (
              <div className="alert">
                ⚠️ Place non sécurisée : aucune preuve enregistrée.
              </div>
            )}

          <div className="ds">
            <div className="dl">Client</div>
            <div className="dr">
              <span className="dk2">Nom</span>
              <span className="dv">{demande.client}</span>
            </div>
            <div className="dr">
              <span className="dk2">WhatsApp</span>
              <span className="dv">{demande.tel}</span>
            </div>
            <div className="dr">
              <span className="dk2">Opérateur</span>
              <span className="dv">{demande.operateur}</span>
            </div>
            <div className="dr">
              <span className="dk2">Source</span>
              <span className="dv">{demande.source}</span>
            </div>
            <div className="dr">
              <span className="dk2">Rabatteur</span>
              <span className="dv">{demande.rabatteur || '—'}</span>
            </div>
          </div>

          <div className="ds">
            <div className="dl">Voyage</div>
            <div className="dr">
              <span className="dk2">Trajet</span>
              <span className="dv">
                {demande.from} → {demande.to}
              </span>
            </div>
            <div className="dr">
              <span className="dk2">Date</span>
              <span className="dv">{demande.date}</span>
            </div>
            <div className="dr">
              <span className="dk2">Heure</span>
              <span className="dv">{demande.heure}</span>
            </div>
            <div className="dr">
              <span className="dk2">Places</span>
              <span className="dv">{demande.places}</span>
            </div>
            <div className="dr">
              <span className="dk2">Prix ticket unitaire</span>
              <span className="dv">
                {demande.prixTicket.toLocaleString()} FCFA
              </span>
            </div>
            <div className="dr">
              <span className="dk2">Montant client</span>
              <span
                className="dv"
                style={{ color: 'var(--g)', fontWeight: 800 }}
              >
                {demande.montant.toLocaleString()} FCFA
              </span>
            </div>
            {demande.besoin && (
              <div className="dr">
                <span className="dk2">Besoin</span>
                <span className="dv">{demande.besoin}</span>
              </div>
            )}
          </div>

          <div className="ds">
            <div className="dl">Contrôle preuves</div>
            <div className="dr">
              <span className="dk2">Preuve place</span>
              <span className={demande.preuvePlace ? 'proof-ok' : 'proof-no'}>
                {demande.preuvePlace ? '✅ Reçue' : '❌ Manquante'}
              </span>
            </div>
            <div className="dr">
              <span className="dk2">Preuve paiement</span>
              <span
                className={demande.preuvePaiement ? 'proof-ok' : 'proof-no'}
              >
                {demande.preuvePaiement ? '✅ Reçue' : '❌ Manquante'}
              </span>
            </div>
          </div>

          <div className="ds">
            <div className="dl">Finance KOYA</div>
            <div className="dr">
              <span className="dk2">Frais KOYA</span>
              <span className="dv">
                {finance.fraisKoya.toLocaleString()} FCFA
              </span>
            </div>
            <div className="dr">
              <span className="dk2">Commission rabatteur</span>
              <span className="dv">
                -{finance.commissionRabatteur.toLocaleString()} FCFA
              </span>
            </div>
            <div className="dr">
              <span className="dk2">Commission vendeur</span>
              <span className="dv">
                -{finance.commissionVendeur.toLocaleString()} FCFA
              </span>
            </div>
            <div className="dr">
              <span className="dk2">Marge KOYA nette</span>
              <span
                className="dv"
                style={{ color: 'var(--g)', fontWeight: 900 }}
              >
                {finance.margeKoya.toLocaleString()} FCFA
              </span>
            </div>
          </div>

          <div className="sep" />

          <div className="ds">
            <div className="dl">Assigner un vendeur</div>
            <div style={{ display: 'flex', gap: 8, marginBottom: 6 }}>
              <select
                className="sel-v"
                value={vend}
                onChange={(e) => setVend(e.target.value)}
              >
                <option value="">Choisir...</option>
                {VENDEURS.filter((v) => v.actif).map((v) => (
                  <option key={v.id} value={v.nom}>
                    {v.nom} — {v.gare} ({v.compagnie})
                  </option>
                ))}
              </select>
              <button className="abtn g" onClick={assignV}>
                OK
              </button>
            </div>
            {demande.vendeur && (
              <div style={{ fontSize: 12, color: 'var(--g)', fontWeight: 700 }}>
                ✓ {demande.vendeur}
              </div>
            )}
          </div>

          <div className="sep" />

          <div className="ds">
            <div className="dl">Actions rapides</div>
            <div className="d-acts">
              {acts
                .filter((a) => a.show.includes(demande.statut))
                .map((a) => (
                  <button
                    key={a.st}
                    className={`abtn ${a.cls}`}
                    onClick={() => (a.custom ? a.custom() : changeStatut(a.st))}
                  >
                    {a.label}
                  </button>
                ))}
            </div>
          </div>

          <div className="sep" />

          <div className="ds">
            <div className="dl">Notes internes</div>
            {demande.notes.map((n, i) => (
              <div key={i} className="note">
                {n}
              </div>
            ))}
            <textarea
              className="ni"
              placeholder="Ajouter une note..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
            <button
              className="abtn b"
              style={{ marginTop: 7 }}
              onClick={addNote}
            >
              + Ajouter
            </button>
          </div>

          <div className="sep" />

          <div className="ds">
            <div className="dl">Lien vendeur partenaire</div>
            <div
              style={{
                background: 'var(--lite)',
                borderRadius: 8,
                padding: '8px 12px',
                fontSize: 12,
                color: 'var(--mid)',
                marginBottom: 8,
              }}
            >
              🔗 koya.app/vendeur?token=abc123_{demande.id}
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="abtn">📋 Copier</button>
              <button className="abtn b">💬 Envoyer WA</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Dashboard({ demandes, onSelect, filtre, setFiltre }) {
  const urgentes = demandes.filter(
    (d) => d.urgent && !['voyage_confirme', 'rembourse'].includes(d.statut)
  ).length;
  const margeTotale = demandes.reduce(
    (acc, d) => acc + calcFinance(d).margeKoya,
    0
  );

  const kpis = [
    {
      label: 'Demandes',
      val: demandes.length,
      color: 'var(--dk)',
      sub: 'Total du jour',
    },
    {
      label: 'En attente',
      val: demandes.filter((d) => d.statut === 'en_attente').length,
      color: 'var(--o)',
      sub: 'À traiter',
    },
    {
      label: 'Places confirmées',
      val: demandes.filter((d) => d.statut === 'place_confirmee').length,
      color: 'var(--g)',
      sub: 'Avec preuve',
    },
    {
      label: 'Voyagés',
      val: demandes.filter((d) => d.statut === 'voyage_confirme').length,
      color: 'var(--b)',
      sub: 'Réussis',
    },
    {
      label: 'Marge KOYA',
      val: margeTotale.toLocaleString(),
      color: 'var(--g)',
      sub: 'FCFA prévisionnel',
    },
  ];

  const filtres = [
    { k: 'tous', label: 'Tous' },
    { k: 'en_attente', label: 'En attente' },
    { k: 'vendeur_contacte', label: 'Vendeur contacté' },
    { k: 'preuve_place', label: 'Preuve reçue' },
    { k: 'place_confirmee', label: 'Confirmées' },
    { k: 'paiement_recu', label: 'Paiement reçu' },
    { k: 'voyage_confirme', label: 'Voyagés' },
    { k: 'probleme', label: 'Problèmes' },
  ];

  const liste =
    filtre === 'tous' ? demandes : demandes.filter((d) => d.statut === filtre);

  return (
    <>
      <div className="topbar">
        <div className="topbar-title">Dashboard Opérateur — KOYA</div>
        <div className="topbar-right">
          {urgentes > 0 && (
            <div className="urg-badge">
              ⚠️ {urgentes} URGENT{urgentes > 1 ? 'S' : ''}
            </div>
          )}
          <div style={{ fontSize: 12, color: 'var(--mid)' }}>
            28 avr. 2026 · 09:14
          </div>
        </div>
      </div>

      <div className="content">
        <div className="kpi-grid">
          {kpis.map((k, i) => (
            <div key={i} className="kpi">
              <div className="kpi-label">{k.label}</div>
              <div className="kpi-val" style={{ color: k.color }}>
                {k.val}
              </div>
              <div className="kpi-sub">{k.sub}</div>
            </div>
          ))}
        </div>

        <div className="table-wrap">
          <div className="table-head-row">
            <div className="table-title">Demandes du jour</div>
            <div className="filters">
              {filtres.map((f) => (
                <button
                  key={f.k}
                  className={`fbtn ${filtre === f.k ? 'active' : ''}`}
                  onClick={() => setFiltre(f.k)}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th>Code</th>
                <th>Client</th>
                <th>Trajet</th>
                <th>Source</th>
                <th>Montant</th>
                <th>Marge</th>
                <th>Preuves</th>
                <th>Statut</th>
                <th></th>
              </tr>
            </thead>

            <tbody>
              {liste.map((d) => {
                const f = calcFinance(d);
                return (
                  <tr key={d.id} onClick={() => onSelect(d)}>
                    <td>
                      <span
                        style={{
                          fontFamily: 'monospace',
                          fontSize: 11,
                          fontWeight: 700,
                          color: 'var(--b)',
                        }}
                      >
                        {d.code}
                      </span>
                      {d.urgent && <span className="urg">URG</span>}
                    </td>

                    <td>
                      <div style={{ fontWeight: 700 }}>{d.client}</div>
                      <div style={{ fontSize: 11, color: 'var(--mid)' }}>
                        {d.tel}
                      </div>
                    </td>

                    <td style={{ fontWeight: 700 }}>
                      {d.from} → {d.to}
                      <div style={{ fontSize: 11, color: 'var(--mid)' }}>
                        {d.date} · {d.heure} · {d.places} place(s)
                      </div>
                    </td>

                    <td style={{ fontSize: 12 }}>
                      {d.source}
                      <div style={{ fontSize: 11, color: 'var(--mid)' }}>
                        {d.rabatteur || 'Sans rabatteur'}
                      </div>
                    </td>

                    <td style={{ fontWeight: 800, color: 'var(--g)' }}>
                      {d.montant.toLocaleString()} FCFA
                    </td>

                    <td style={{ fontWeight: 800, color: 'var(--g)' }}>
                      {f.margeKoya.toLocaleString()} FCFA
                    </td>

                    <td>
                      <div className={d.preuvePlace ? 'proof-ok' : 'proof-no'}>
                        Place {d.preuvePlace ? 'OK' : 'NON'}
                      </div>
                      <div
                        className={d.preuvePaiement ? 'proof-ok' : 'proof-no'}
                      >
                        Paiement {d.preuvePaiement ? 'OK' : 'NON'}
                      </div>
                    </td>

                    <td>
                      <Badge statut={d.statut} />
                    </td>

                    <td onClick={(e) => e.stopPropagation()}>
                      <button className="abtn" onClick={() => onSelect(d)}>
                        Ouvrir →
                      </button>
                    </td>
                  </tr>
                );
              })}

              {liste.length === 0 && (
                <tr>
                  <td
                    colSpan={9}
                    style={{
                      textAlign: 'center',
                      padding: '24px',
                      color: 'var(--mid)',
                    }}
                  >
                    Aucune demande
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default function KoyaBackOffice() {
  const [view, setView] = useState('dashboard');
  const [demandes, setDemandes] = useState(DEMO_DEMANDES);
  const [selected, setSelected] = useState(null);
  const [filtre, setFiltre] = useState('tous');
  const [vendeurDem, setVendeurDem] = useState(null);

  function update(id, changes) {
    setDemandes((p) => p.map((d) => (d.id === id ? { ...d, ...changes } : d)));
    if (selected?.id === id) setSelected((p) => ({ ...p, ...changes }));
  }

  const navItems = [
    { key: 'dashboard', icon: '📊', label: 'Dashboard' },
    { key: 'demandes', icon: '📋', label: 'Demandes' },
    { key: 'vendeurs', icon: '👤', label: 'Vendeurs' },
    { key: 'vendeur_demo', icon: '📱', label: 'Vue Vendeur', demo: true },
  ];

  if (view === 'vendeur_demo') {
    return (
      <>
        <style>{css}</style>
        <VendeurUI
          demande={vendeurDem || demandes[0]}
          onBack={() => setView('dashboard')}
        />
      </>
    );
  }

  return (
    <>
      <style>{css}</style>

      <div className="layout">
        <div className="sidebar">
          <div className="sidebar-logo">
            <div className="logo-text">
              KOYA<span>.</span>
            </div>
            <div className="logo-sub">BACK-OFFICE OPÉRATEUR</div>
          </div>

          <div className="sidebar-nav">
            {navItems.map((item) => (
              <div
                key={item.key}
                className={`nav-item ${view === item.key ? 'active' : ''}`}
                onClick={() => {
                  if (item.demo) {
                    setVendeurDem(demandes[0]);
                    setView('vendeur_demo');
                  } else {
                    setView(item.key);
                  }
                }}
              >
                <span className="nav-icon">{item.icon}</span>
                {item.label}
                {item.demo && (
                  <span
                    style={{
                      fontSize: 9,
                      background: 'var(--o)',
                      color: '#fff',
                      padding: '1px 5px',
                      borderRadius: 4,
                      marginLeft: 'auto',
                    }}
                  >
                    DEMO
                  </span>
                )}
              </div>
            ))}
          </div>

          <div className="sidebar-footer">
            <div className="sidebar-user">Connecté en tant que</div>
            <div className="sidebar-name">Coulibaly Amadou · Ops CI</div>
          </div>
        </div>

        <div className="main">
          <Dashboard
            demandes={demandes}
            onSelect={setSelected}
            filtre={filtre}
            setFiltre={setFiltre}
          />
        </div>

        {selected && (
          <FicheDrawer
            demande={selected}
            onClose={() => setSelected(null)}
            onUpdate={update}
          />
        )}
      </div>
    </>
  );
}
