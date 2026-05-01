// @ts-nocheck
import { useState, useEffect } from "react";

// ── CONFIG ────────────────────────────────────────────────────
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxifL7v1waw1Ko_ekZkUtfNLaO54wtT15vTEYY82iYxZTFdXYuNU5rCghMaioFZmjvLZg/exec";
const KOYA_WA_NUM = "2250142299949";

// ── STATUTS ───────────────────────────────────────────────────
const STATUTS = {
  nouveau:    { label:"Nouveau",     color:"#E07B00", bg:"#FFF4E6", dot:"#E07B00" },
  en_cours:   { label:"En cours",    color:"#1B4F8A", bg:"#EBF2FA", dot:"#1B4F8A" },
  confirme:   { label:"Confirmé ✅",  color:"#1A6B3A", bg:"#EAF7EE", dot:"#1A6B3A" },
  perdu:      { label:"Perdu ❌",     color:"#C0392B", bg:"#FDF0EF", dot:"#C0392B" },
  // compatibilité anciens statuts
  en_attente:       { label:"En attente",    color:"#E07B00", bg:"#FFF4E6", dot:"#E07B00" },
  vendeur_contacte: { label:"En cours",      color:"#1B4F8A", bg:"#EBF2FA", dot:"#1B4F8A" },
  place_confirmee:  { label:"Confirmé ✅",   color:"#1A6B3A", bg:"#EAF7EE", dot:"#1A6B3A" },
  paiement_recu:    { label:"Confirmé ✅",   color:"#1A6B3A", bg:"#EAF7EE", dot:"#1A6B3A" },
  voyage_confirme:  { label:"Voyagé ✅",     color:"#0A4A2A", bg:"#C8EDD8", dot:"#0A4A2A" },
  place_refusee:    { label:"Perdu ❌",      color:"#C0392B", bg:"#FDF0EF", dot:"#C0392B" },
  probleme:         { label:"Problème ⚠️",   color:"#C0392B", bg:"#FDF0EF", dot:"#C0392B" },
  rembourse:        { label:"Remboursé",     color:"#666",   bg:"#F0F0F0", dot:"#666"    },
  code_envoye:      { label:"Code envoyé",  color:"#1A6B3A", bg:"#EAF7EE", dot:"#1A6B3A" },
};

// ── MAPPING COLONNES GOOGLE SHEET → FORMAT INTERNE ───────────
function mapRow(row, index) {
  const urgent = String(row["Urgent"] || row["urgent"] || "").toUpperCase() === "OUI";
  const statutRaw = String(row["Statut"] || row["statut"] || "nouveau").toLowerCase().replace(/\s/g,"_");
  const trajet = String(row["Trajet"] || "");
  let from = "", to = "";
  if (trajet.includes("→")) { [from, to] = trajet.split("→").map(s=>s.trim()); }
  else if (trajet.includes("->")) { [from, to] = trajet.split("->").map(s=>s.trim()); }
  else { from = trajet; }

  const notesRaw = String(row["Notes"] || row["notes"] || "");
  const notes = notesRaw ? notesRaw.split("\n").filter(Boolean) : [];

  return {
    id:        index,
    _row:      row._row || index + 2,
    code:      String(row["Code Demande"] || row["code"] || `KOYA-${index+1}`),
    client:    String(row["Nom Client"]   || row["name"] || "—"),
    tel:       String(row["WhatsApp Client"] || row["phone"] || ""),
    from,
    to,
    date:      String(row["Date Voyage"]  || row["date"] || ""),
    heure:     String(row["Heure"]        || row["hour"] || ""),
    places:    parseInt(row["Places"]     || row["seats"] || "1") || 1,
    montant:   String(row["Montant Estimé"] || row["total"] || ""),
    operateur: String(row["Opérateur"]    || row["operator"] || ""),
    pref:      String(row["Préférence"]   || row["pref"] || ""),
    besoin:    String(row["Besoin Particulier"] || row["besoin"] || ""),
    urgent,
    statut:    statutRaw || "nouveau",
    notes,
    createdAt: String(row["Date Demande"] || row["datedemande"] || ""),
  };
}

// ── APPEL SHEET ───────────────────────────────────────────────
async function fetchDemandes() {
  const res = await fetch(SCRIPT_URL);
  const json = await res.json();
  if (!Array.isArray(json)) throw new Error("Format inattendu");
  return json.map((row, i) => mapRow(row, i));
}

async function updateSheet(code, changes) {
  try {
    await fetch(SCRIPT_URL, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code, ...changes }),
    });
  } catch (_) {}
}

// ── CSS ───────────────────────────────────────────────────────
const css = `
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:wght@300;400;500;700&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{
  --g:#1A5C38;--g2:#237A4B;--lg:#EAF7EE;
  --o:#E07B00;--lo:#FFF4E6;
  --b:#1B4F8A;--lb:#EBF2FA;
  --dk:#0D1B0F;--mid:#4A5568;--lite:#F7F9F7;--bd:#D4DDE0;--w:#FFFFFF;
  --r:#C0392B;--lr:#FDF0EF;
  --sh:0 1px 3px rgba(0,0,0,.08),0 4px 16px rgba(0,0,0,.06);
}
body{font-family:'DM Sans',sans-serif;background:var(--lite);color:var(--dk);min-height:100vh;font-size:14px}
.layout{display:flex;min-height:100vh}
.sidebar{width:240px;background:var(--dk);flex-shrink:0;position:fixed;top:0;left:0;height:100vh;z-index:100;display:flex;flex-direction:column}
.main{margin-left:240px;flex:1;display:flex;flex-direction:column}
.sb-logo{padding:20px 18px 14px;border-bottom:1px solid rgba(255,255,255,.08)}
.sb-logo-text{font-family:'Syne',sans-serif;font-size:22px;font-weight:800;color:#fff;letter-spacing:2px}
.sb-logo-text span{color:var(--o)}
.sb-sub{font-size:10px;color:rgba(255,255,255,.4);letter-spacing:1px;margin-top:2px}
.sb-role{margin:10px 14px;border-radius:8px;overflow:hidden;border:1px solid rgba(255,255,255,.1)}
.sb-role-btn{width:50%;padding:7px 4px;font-size:11px;font-weight:700;border:none;cursor:pointer;font-family:'Syne',sans-serif;background:transparent;color:rgba(255,255,255,.4)}
.sb-role-btn.active{background:var(--o);color:#fff}
.sb-nav{padding:10px 0;flex:1}
.nav-item{display:flex;align-items:center;gap:9px;padding:9px 18px;font-size:13px;font-weight:500;color:rgba(255,255,255,.6);cursor:pointer;transition:all .15s;border-left:3px solid transparent}
.nav-item:hover{color:#fff;background:rgba(255,255,255,.05)}
.nav-item.active{color:#fff;background:rgba(255,255,255,.08);border-left-color:var(--o)}
.nav-badge{margin-left:auto;background:var(--r);color:#fff;font-size:10px;font-weight:800;padding:2px 6px;border-radius:10px}
.sb-footer{padding:12px 18px;border-top:1px solid rgba(255,255,255,.08)}
.sb-user-role{font-size:10px;color:rgba(255,255,255,.4);text-transform:uppercase;letter-spacing:.5px}
.sb-user-name{color:rgba(255,255,255,.85);font-weight:600;font-size:12px;margin-top:2px}
.topbar{background:var(--w);border-bottom:1px solid var(--bd);padding:0 24px;height:56px;display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;z-index:90}
.topbar-title{font-family:'Syne',sans-serif;font-size:15px;font-weight:700;color:var(--dk)}
.topbar-right{display:flex;align-items:center;gap:10px}
.alert-badge{background:var(--lr);color:var(--r);font-size:11px;font-weight:700;padding:3px 9px;border-radius:20px;border:1px solid rgba(192,57,43,.2)}
.content{padding:20px 24px;flex:1}
.kpi-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:20px}
.kpi{background:var(--w);border-radius:12px;padding:16px 14px;box-shadow:var(--sh);border:1px solid var(--bd)}
.kpi-label{font-size:10px;color:var(--mid);font-weight:700;text-transform:uppercase;letter-spacing:.5px;margin-bottom:6px}
.kpi-val{font-family:'Syne',sans-serif;font-size:26px;font-weight:800;margin-bottom:2px}
.kpi-sub{font-size:11px;color:var(--mid)}
.table-card{background:var(--w);border-radius:12px;box-shadow:var(--sh);border:1px solid var(--bd);overflow:hidden}
.table-toolbar{padding:12px 16px;border-bottom:1px solid var(--bd);display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:8px}
.table-title{font-family:'Syne',sans-serif;font-size:14px;font-weight:700;color:var(--dk)}
.filters{display:flex;gap:6px;flex-wrap:wrap}
.fbtn{font-size:11px;font-weight:600;padding:4px 10px;border-radius:6px;border:1px solid var(--bd);background:var(--w);cursor:pointer;color:var(--mid);transition:all .15s}
.fbtn.active{background:var(--g);color:#fff;border-color:var(--g)}
table{width:100%;border-collapse:collapse}
th{padding:9px 12px;text-align:left;font-size:10px;font-weight:700;color:var(--mid);text-transform:uppercase;letter-spacing:.5px;border-bottom:1px solid var(--bd);background:var(--lite)}
td{padding:10px 12px;border-bottom:1px solid #F0F4F1;vertical-align:middle;font-size:13px}
tr:last-child td{border-bottom:none}
tr:hover td{background:#FAFCFA;cursor:pointer}
.badge{display:inline-flex;align-items:center;gap:4px;font-size:11px;font-weight:700;padding:3px 8px;border-radius:20px}
.bdot{width:6px;height:6px;border-radius:50%;flex-shrink:0}
.urg-tag{background:var(--lr);color:var(--r);font-size:9px;font-weight:800;padding:2px 5px;border-radius:4px;margin-left:4px}
.abtn{font-size:12px;font-weight:700;padding:5px 10px;border-radius:7px;border:1px solid var(--bd);background:var(--w);cursor:pointer;color:var(--mid);transition:all .15s;display:inline-flex;align-items:center;gap:4px}
.abtn:hover{background:var(--lite)}
.abtn.g{background:var(--lg);color:var(--g);border-color:rgba(26,92,56,.2)}
.abtn.r{background:var(--lr);color:var(--r);border-color:rgba(192,57,43,.2)}
.abtn.b{background:var(--lb);color:var(--b);border-color:rgba(27,79,138,.2)}
.abtn.o{background:var(--lo);color:var(--o);border-color:rgba(224,123,0,.2)}
.abtn.wa{background:#25D366;color:#fff;border-color:#25D366}
.overlay{position:fixed;inset:0;background:rgba(0,0,0,.45);z-index:200;display:flex;align-items:flex-start;justify-content:flex-end}
.drawer{background:var(--w);width:500px;height:100vh;overflow-y:auto;box-shadow:-4px 0 24px rgba(0,0,0,.15);display:flex;flex-direction:column}
.dh{padding:16px 20px;border-bottom:1px solid var(--bd);display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;background:var(--w);z-index:10}
.dh-title{font-family:'Syne',sans-serif;font-size:14px;font-weight:700;color:var(--dk)}
.xbtn{width:28px;height:28px;border-radius:6px;border:1px solid var(--bd);background:var(--w);cursor:pointer;font-size:16px;display:flex;align-items:center;justify-content:center}
.db{padding:18px 20px;flex:1}
.ds{margin-bottom:16px}
.dl{font-size:10px;font-weight:700;color:var(--mid);text-transform:uppercase;letter-spacing:.5px;margin-bottom:7px}
.dr{display:flex;justify-content:space-between;gap:12px;padding:5px 0;border-bottom:1px solid #F0F4F1;font-size:13px}
.dr:last-child{border-bottom:none}
.dk2{color:var(--mid)}
.dv{font-weight:700;color:var(--dk);text-align:right}
.sep{height:1px;background:var(--bd);margin:14px 0}
.d-acts{display:flex;flex-wrap:wrap;gap:7px;margin-bottom:10px}
.ni{width:100%;border:1.5px solid var(--bd);border-radius:8px;padding:8px 10px;font-size:13px;font-family:'DM Sans',sans-serif;color:var(--dk);resize:none;height:64px;outline:none}
.note-item{background:var(--lite);border-radius:6px;padding:7px 10px;font-size:12px;color:var(--mid);margin-bottom:5px;border-left:3px solid var(--bd)}
.toast{position:fixed;bottom:24px;right:24px;background:var(--dk);color:#fff;padding:10px 18px;border-radius:10px;font-size:13px;font-weight:600;z-index:999;box-shadow:0 4px 20px rgba(0,0,0,.25);transition:opacity .3s}
.loader{display:flex;align-items:center;justify-content:center;height:200px;font-size:14px;color:var(--mid);flex-direction:column;gap:12px}
.spin{width:32px;height:32px;border:3px solid var(--bd);border-top-color:var(--g);border-radius:50%;animation:spin .8s linear infinite}
@keyframes spin{to{transform:rotate(360deg)}}
.empty{text-align:center;padding:40px;color:var(--mid)}
.reload-btn{background:var(--g);color:#fff;border:none;border-radius:8px;padding:8px 16px;font-size:13px;font-weight:700;cursor:pointer;margin-top:12px}
@media(max-width:768px){
  .sidebar{display:none}
  .main{margin-left:0}
  .kpi-grid{grid-template-columns:repeat(2,1fr)}
  .drawer{width:100%}
  table{font-size:12px}
}
`;

// ── Badge statut ───────────────────────────────────────────────
function Badge({ statut }) {
  const s = STATUTS[statut] || STATUTS.nouveau;
  return (
    <span className="badge" style={{background:s.bg,color:s.color}}>
      <span className="bdot" style={{background:s.dot}}></span>
      {s.label}
    </span>
  );
}

// ── Toast feedback ─────────────────────────────────────────────
function Toast({ msg }) {
  if (!msg) return null;
  return <div className="toast">{msg}</div>;
}

// ── Fiche demande ──────────────────────────────────────────────
function FicheDrawer({ demande, role, onClose, onUpdate, showToast }) {
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);

  async function changeStatut(statut) {
    setSaving(true);
    onUpdate(demande.id, { statut });
    await updateSheet(demande.code, { statut });
    setSaving(false);
    showToast("Statut mis à jour ✅");
  }

  async function addNote() {
    if (!note.trim()) return;
    setSaving(true);
    const newNotes = [...demande.notes, note.trim()];
    onUpdate(demande.id, { notes: newNotes });
    await updateSheet(demande.code, { note: note.trim() });
    setNote("");
    setSaving(false);
    showToast("Note ajoutée ✅");
  }

  function openWhatsApp() {
    const tel = demande.tel.replace(/\D/g,"");
    const num = tel.startsWith("00") ? tel.slice(2) : tel.startsWith("225") ? tel : "225"+tel;
    const msg = encodeURIComponent(
      `Bonjour ${demande.client},\n\nConcernant votre demande KOYA : ${demande.code}\nTrajet : ${demande.from} → ${demande.to}\nDate : ${demande.date} à ${demande.heure}\n\n— KOYA Service`
    );
    window.open(`https://wa.me/${num}?text=${msg}`, "_blank");
  }

  const canConfirm  = !["confirme","perdu","voyage_confirme"].includes(demande.statut);
  const canPerdu    = !["perdu","place_refusee"].includes(demande.statut);
  const canEnCours  = demande.statut === "nouveau" || demande.statut === "en_attente";

  return (
    <div className="overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="drawer">
        <div className="dh">
          <div>
            <div className="dh-title">{demande.code}</div>
            {demande.urgent && <span className="urg-tag">URGENT</span>}
          </div>
          <button className="xbtn" onClick={onClose}>×</button>
        </div>

        <div className="db">

          {/* Statut */}
          <div className="ds">
            <div className="dl">Statut actuel</div>
            <Badge statut={demande.statut} />
          </div>

          {/* Client */}
          <div className="ds">
            <div className="dl">Client</div>
            <div className="dr"><span className="dk2">Nom</span><span className="dv">{demande.client}</span></div>
            <div className="dr"><span className="dk2">WhatsApp</span><span className="dv">{demande.tel || "—"}</span></div>
            <div className="dr"><span className="dk2">Opérateur</span><span className="dv">{demande.operateur || "—"}</span></div>
            {demande.pref && <div className="dr"><span className="dk2">Préférence</span><span className="dv">{demande.pref}</span></div>}
          </div>

          {/* Voyage */}
          <div className="ds">
            <div className="dl">Voyage</div>
            <div className="dr"><span className="dk2">Trajet</span><span className="dv">{demande.from} → {demande.to}</span></div>
            <div className="dr"><span className="dk2">Date</span><span className="dv">{demande.date}</span></div>
            <div className="dr"><span className="dk2">Heure</span><span className="dv">{demande.heure}</span></div>
            <div className="dr"><span className="dk2">Places</span><span className="dv">{demande.places}</span></div>
            <div className="dr"><span className="dk2">Montant</span><span className="dv" style={{color:"var(--g)",fontWeight:800}}>{demande.montant} FCFA</span></div>
            {demande.besoin && <div className="dr"><span className="dk2">Besoin</span><span className="dv">{demande.besoin}</span></div>}
            <div className="dr"><span className="dk2">Demande reçue</span><span className="dv">{demande.createdAt}</span></div>
          </div>

          <div className="sep"/>

          {/* Contact WhatsApp */}
          <div className="ds">
            <div className="dl">Contacter le client</div>
            <button className="abtn wa" onClick={openWhatsApp}>
              💬 Ouvrir WhatsApp
            </button>
          </div>

          <div className="sep"/>

          {/* Actions statut */}
          <div className="ds">
            <div className="dl">Changer le statut</div>
            <div className="d-acts">
              {canEnCours  && <button className="abtn b" onClick={()=>changeStatut("en_cours")} disabled={saving}>🔄 En cours</button>}
              {canConfirm  && <button className="abtn g" onClick={()=>changeStatut("confirme")} disabled={saving}>✅ Confirmer</button>}
              {canPerdu    && <button className="abtn r" onClick={()=>changeStatut("perdu")}    disabled={saving}>❌ Perdu</button>}
            </div>
            {saving && <div style={{fontSize:12,color:"var(--mid)"}}>Enregistrement...</div>}
          </div>

          <div className="sep"/>

          {/* Notes */}
          <div className="ds">
            <div className="dl">Notes internes</div>
            {demande.notes.length === 0 && <div style={{fontSize:12,color:"var(--mid)",marginBottom:8}}>Aucune note</div>}
            {demande.notes.map((n,i) => <div key={i} className="note-item">{n}</div>)}
            <textarea
              className="ni"
              style={{marginTop:8}}
              placeholder="Ajouter une note..."
              value={note}
              onChange={e=>setNote(e.target.value)}
            />
            <button className="abtn b" style={{marginTop:7}} onClick={addNote} disabled={saving || !note.trim()}>
              + Ajouter
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

// ── Dashboard ──────────────────────────────────────────────────
function Dashboard({ demandes, loading, role, filtre, setFiltre, onSelect, onReload }) {
  const urgentes  = demandes.filter(d => d.urgent && !["confirme","perdu","voyage_confirme"].includes(d.statut)).length;
  const nouveau   = demandes.filter(d => ["nouveau","en_attente"].includes(d.statut)).length;
  const confirmes = demandes.filter(d => ["confirme","paiement_recu","voyage_confirme","code_envoye"].includes(d.statut)).length;
  const perdus    = demandes.filter(d => ["perdu","place_refusee"].includes(d.statut)).length;

  const kpisCEO = [
    { label:"Total demandes", val:demandes.length,  color:"var(--dk)", sub:"Toutes" },
    { label:"Nouvelles",      val:nouveau,           color:"var(--o)",  sub:"À traiter" },
    { label:"Confirmées",     val:confirmes,         color:"var(--g)",  sub:"Places sécurisées" },
    { label:"Perdues",        val:perdus,            color:"var(--r)",  sub:"Non converties" },
  ];
  const kpisOps = [
    { label:"Mes demandes",   val:demandes.length,  color:"var(--dk)", sub:"Total" },
    { label:"🔴 Urgentes",    val:urgentes,          color:"var(--r)",  sub:"Priorité absolue" },
    { label:"À traiter",      val:nouveau,           color:"var(--o)",  sub:"En attente" },
    { label:"Confirmées",     val:confirmes,         color:"var(--g)",  sub:"Réussies" },
  ];
  const kpis = role === "ceo" ? kpisCEO : kpisOps;

  const filtres = [
    {k:"tous",     label:"Tous"},
    {k:"nouveau",  label:"Nouveaux"},
    {k:"en_cours", label:"En cours"},
    {k:"confirme", label:"Confirmés"},
    {k:"perdu",    label:"Perdus"},
  ];

  const sorted = [...demandes].sort((a,b) => {
    if (a.urgent && !b.urgent) return -1;
    if (!a.urgent && b.urgent) return 1;
    return 0;
  });

  const liste = filtre === "tous" ? sorted : sorted.filter(d => {
    if (filtre === "nouveau")  return ["nouveau","en_attente"].includes(d.statut);
    if (filtre === "en_cours") return ["en_cours","vendeur_contacte"].includes(d.statut);
    if (filtre === "confirme") return ["confirme","paiement_recu","voyage_confirme","code_envoye"].includes(d.statut);
    if (filtre === "perdu")    return ["perdu","place_refusee","probleme"].includes(d.statut);
    return d.statut === filtre;
  });

  return <>
    <div className="topbar">
      <div className="topbar-title">
        {role === "ceo" ? "Dashboard CEO — KOYA" : "Dashboard Opérateur — KOYA"}
      </div>
      <div className="topbar-right">
        {urgentes > 0 && <div className="alert-badge">🔴 {urgentes} URGENT{urgentes>1?"S":""}</div>}
        <button className="abtn" onClick={onReload} disabled={loading}>
          {loading ? "⏳" : "🔄"} Actualiser
        </button>
      </div>
    </div>

    <div className="content">
      <div className="kpi-grid">
        {kpis.map((k,i) => (
          <div key={i} className="kpi">
            <div className="kpi-label">{k.label}</div>
            <div className="kpi-val" style={{color:k.color}}>{k.val}</div>
            <div className="kpi-sub">{k.sub}</div>
          </div>
        ))}
      </div>

      <div className="table-card">
        <div className="table-toolbar">
          <div className="table-title">Demandes — triées par priorité</div>
          <div className="filters">
            {filtres.map(f => (
              <button key={f.k} className={`fbtn ${filtre===f.k?"active":""}`} onClick={()=>setFiltre(f.k)}>
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="loader">
            <div className="spin"></div>
            Chargement des demandes...
          </div>
        ) : liste.length === 0 ? (
          <div className="empty">
            <div style={{fontSize:32,marginBottom:8}}>📭</div>
            <div>Aucune demande dans cette catégorie</div>
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Code</th>
                <th>Client</th>
                <th>Trajet</th>
                <th>Date · Heure</th>
                <th>Places</th>
                <th>Montant</th>
                <th>Statut</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {liste.map(d => (
                <tr key={d.id} onClick={()=>onSelect(d)}>
                  <td>
                    <span style={{fontFamily:"monospace",fontSize:11,fontWeight:700,color:"var(--b)"}}>{d.code}</span>
                    {d.urgent && <span className="urg-tag">URG</span>}
                  </td>
                  <td>
                    <div style={{fontWeight:700}}>{d.client}</div>
                    <div style={{fontSize:11,color:"var(--mid)"}}>{d.tel}</div>
                  </td>
                  <td style={{fontWeight:600}}>{d.from || "—"} → {d.to || "—"}</td>
                  <td style={{fontSize:12}}>
                    {d.date}<br/>
                    <span style={{color:"var(--mid)"}}>{d.heure} · {d.places} pl.</span>
                  </td>
                  <td style={{fontWeight:700}}>{d.places}</td>
                  <td style={{fontWeight:700,color:"var(--g)"}}>{d.montant ? d.montant+" F" : "—"}</td>
                  <td><Badge statut={d.statut}/></td>
                  <td onClick={e=>e.stopPropagation()}>
                    <button className="abtn" onClick={()=>onSelect(d)}>Ouvrir →</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  </>;
}

// ── App principale ─────────────────────────────────────────────
export default function KoyaBackOffice() {
  const [role,     setRole]     = useState("ops");
  const [demandes, setDemandes] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [erreur,   setErreur]   = useState("");
  const [selected, setSelected] = useState(null);
  const [filtre,   setFiltre]   = useState("tous");
  const [toast,    setToast]    = useState("");

  function showToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  }

  async function load() {
    setLoading(true);
    setErreur("");
    try {
      const data = await fetchDemandes();
      setDemandes(data);
    } catch (e) {
      setErreur("Impossible de charger les demandes. Vérifie la connexion ou le script.");
    }
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  function update(id, changes) {
    setDemandes(prev => prev.map(d => d.id === id ? {...d, ...changes} : d));
    if (selected?.id === id) setSelected(prev => ({...prev, ...changes}));
  }

  const nouveau = demandes.filter(d => ["nouveau","en_attente"].includes(d.statut)).length;

  return <>
    <style>{css}</style>
    <div className="layout">

      {/* SIDEBAR */}
      <div className="sidebar">
        <div className="sb-logo">
          <div className="sb-logo-text">KOYA<span>.</span></div>
          <div className="sb-sub">BACK-OFFICE</div>
        </div>

        <div style={{padding:"10px 14px 0"}}>
          <div className="sb-role">
            <button className={`sb-role-btn ${role==="ops"?"active":""}`} onClick={()=>setRole("ops")}>Opérateur</button>
            <button className={`sb-role-btn ${role==="ceo"?"active":""}`} onClick={()=>setRole("ceo")}>CEO</button>
          </div>
        </div>

        <div className="sb-nav">
          <div className="nav-item active">
            <span>📋</span>
            Demandes
            {nouveau > 0 && <span className="nav-badge">{nouveau}</span>}
          </div>
        </div>

        <div className="sb-footer">
          <div className="sb-user-role">{role==="ceo"?"CEO & Fondateur":"Délégué Opérationnel"}</div>
          <div className="sb-user-name">{role==="ceo"?"TONGBÉ Désiré":"Coulibaly Amadou"}</div>
        </div>
      </div>

      {/* MAIN */}
      <div className="main">
        {erreur ? (
          <>
            <div className="topbar"><div className="topbar-title">Back-office KOYA</div></div>
            <div className="content">
              <div className="loader">
                <div style={{fontSize:32}}>⚠️</div>
                <div style={{color:"var(--r)",fontWeight:700}}>{erreur}</div>
                <button className="reload-btn" onClick={load}>Réessayer</button>
              </div>
            </div>
          </>
        ) : (
          <Dashboard
            demandes={demandes}
            loading={loading}
            role={role}
            filtre={filtre}
            setFiltre={setFiltre}
            onSelect={setSelected}
            onReload={load}
          />
        )}
      </div>

      {/* FICHE DEMANDE */}
      {selected && (
        <FicheDrawer
          demande={selected}
          role={role}
          onClose={()=>setSelected(null)}
          onUpdate={update}
          showToast={showToast}
        />
      )}

    </div>

    <Toast msg={toast}/>
  </>;
}
