// Adaptateur de stockage pour un dossier choisi avec showDirectoryPicker (Chrome, Edge), voir stockage.js.
(function (racine) {
  "use strict";

  function creerAdaptateurDossier(poigneeRacine) {
    function decouper(chemin) {
      var parties = chemin.split("/").filter(Boolean);
      return { dossiers: parties.slice(0, -1), nom: parties[parties.length - 1] };
    }

    // Renvoie le sous-dossier, ou null s'il n'existe pas et qu'on ne doit pas le créer.
    async function sousDossier(parties, creer) {
      var dossier = poigneeRacine;
      for (var i = 0; i < parties.length; i++) {
        try {
          dossier = await dossier.getDirectoryHandle(parties[i], { create: creer });
        } catch (e) {
          if (!creer && e.name === "NotFoundError") return null;
          throw e;
        }
      }
      return dossier;
    }

    async function lireFichier(chemin) {
      var c = decouper(chemin);
      var dossier = await sousDossier(c.dossiers, false);
      if (!dossier) return null;
      try {
        return await (await dossier.getFileHandle(c.nom)).getFile();
      } catch (e) {
        if (e.name === "NotFoundError") return null;
        throw e;
      }
    }

    async function ecrire(chemin, contenu) {
      var c = decouper(chemin);
      var dossier = await sousDossier(c.dossiers, true);
      var flux = await (await dossier.getFileHandle(c.nom, { create: true })).createWritable();
      await flux.write(contenu);
      await flux.close();
    }

    return {
      lireTexte: async function (chemin) { var f = await lireFichier(chemin); return f ? f.text() : null; },
      ecrireTexte: ecrire,
      lireOctets: lireFichier,
      ecrireOctets: ecrire,
      lister: async function (chemin) {
        var dossier = await sousDossier(chemin.split("/").filter(Boolean), false);
        if (!dossier) return [];
        var entrees = [];
        for await (var [nom, poignee] of dossier.entries()) {
          entrees.push({ nom: nom, type: poignee.kind === "file" ? "fichier" : "dossier" });
        }
        return entrees;
      }
    };
  }

  racine.EscapeLabStockage.creerAdaptateurDossier = creerAdaptateurDossier;
})(this);
