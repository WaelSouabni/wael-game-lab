// Tests de la logique des jeux. Lancer : npm test
const path=require('path');
console.log('\n== jardin-des-formes ==');{
const fs=require('fs'),assert=require('assert');
const h=fs.readFileSync(path.join(__dirname,'..','games','jardin-des-formes.html'),'utf8');
const code=h.split('// LOGIC-START')[1].split('// LOGIC-END')[0];
const L=new Function(code+';return{buildLevel,isMatch,needsHint,badgesFor,finalBadges,shuffle,TOTAL_LEVELS};')();
let n=0;const t=(name,f)=>{f();n++;console.log('ok -',name)};
t('niveau 1 a 2 formes, niveau 5 a 6',()=>{assert.equal(L.buildLevel(1).items.length,2);assert.equal(L.buildLevel(5).items.length,6)});
t('ids uniques et chaque forme a un pot',()=>{for(let k=1;k<=5;k++){const v=L.buildLevel(k);assert.equal(new Set(v.items.map(i=>i.id)).size,v.items.length);v.items.forEach(i=>assert.ok(v.slots.some(s=>L.isMatch(i,s))))}});
t('couleurs distinctes dans un niveau',()=>{const v=L.buildLevel(5);assert.equal(new Set(v.items.map(i=>i.color)).size,6)});
t('mélange conserve les éléments',()=>{assert.deepEqual(L.shuffle([1,2,3,4],Math.random).sort(),[1,2,3,4])});
t('isMatch refuse un mauvais pot',()=>{assert.equal(L.isMatch({id:1},{id:2}),false)});
t('indice après 2 erreurs',()=>{assert.equal(L.needsHint(1),false);assert.equal(L.needsHint(2),true)});
t('badge persévérant à 3 erreurs',()=>{assert.deepEqual(L.badgesFor({errors:3,hints:1}),['perseverant'])});
t('badge observateur sans erreur ni aide',()=>{assert.deepEqual(L.badgesFor({errors:0,hints:0}),['observer'])});
t('aucun badge à 1 erreur',()=>{assert.deepEqual(L.badgesFor({errors:1,hints:0}),[])});
t('jardinier après 5 niveaux',()=>{assert.deepEqual(L.finalBadges(5),['gardener']);assert.deepEqual(L.finalBadges(4),[])});
console.log(n+' tests réussis');
}
console.log('\n== complete-la-suite ==');{
const fs=require('fs'),assert=require('assert');
const h=fs.readFileSync(path.join(__dirname,'..','games','complete-la-suite.html'),'utf8');
const code=h.split('// LOGIC-START')[1].split('// LOGIC-END')[0];
const L=new Function(code+';return{buildPattern,isCorrect,needsHint,badgesFor,finalBadges,shuffle,UNITS};')();
let n=0;const t=(m,f)=>{f();n++;console.log('ok -',m)};
t('la suite répète bien le motif',()=>{for(let k=1;k<=5;k++){const p=L.buildPattern(k),u=L.UNITS[k-1];p.seq.forEach((s,i)=>assert.equal(s.key,p.seq[i%u.length].key))}});
t('1 case cachée aux niveaux 1-3, 2 aux niveaux 4-5',()=>{for(let k=1;k<=5;k++){const p=L.buildPattern(k);assert.equal(p.seq.length-p.start,k>=4?2:1)}});
t('les choix contiennent toutes les réponses',()=>{for(let k=1;k<=5;k++){const p=L.buildPattern(k);for(let i=p.start;i<p.seq.length;i++)assert.ok(p.choices.some(c=>c.key===p.seq[i].key))}});
t('choix uniques, avec un intrus',()=>{for(let k=1;k<=5;k++){const p=L.buildPattern(k),u=new Set(L.UNITS[k-1]);assert.equal(new Set(p.choices.map(c=>c.key)).size,p.choices.length);assert.equal(p.choices.length,u.size+1)}});
t('isCorrect accepte le bon, refuse le mauvais',()=>{const p=L.buildPattern(1);assert.ok(L.isCorrect(p,p.start,p.seq[p.start].key));assert.ok(!L.isCorrect(p,p.start,'x'))});
t('indice après 2 erreurs',()=>{assert.ok(!L.needsHint(1));assert.ok(L.needsHint(2))});
t('badges',()=>{assert.deepEqual(L.badgesFor({errors:3,hints:1}),['perseverant']);assert.deepEqual(L.badgesFor({errors:0,hints:0}),['observer']);assert.deepEqual(L.finalBadges(5),['master']);assert.deepEqual(L.finalBadges(4),[])});
console.log(n+' tests réussis');
}
console.log('\n== guide-le-robot ==');{
const fs=require('fs'),assert=require('assert');
const h=fs.readFileSync(path.join(__dirname,'..','games','guide-le-robot.html'),'utf8');
const code=h.split('// LOGIC-START')[1].split('// LOGIC-END')[0];
const X=new Function(code+';return{LEVELS,simulate,solve,needsHint,badgesFor,finalBadges,MAX_STEPS};')();
let n=0;const t=(m,f)=>{f();n++;console.log('ok -',m)};
t('chaque niveau a une solution',()=>X.LEVELS.forEach((L,i)=>assert.ok(X.solve(L),'niveau '+(i+1))));
t('la solution atteint bien l’étoile',()=>X.LEVELS.forEach(L=>assert.equal(X.simulate(L,X.solve(L)).status,'goal')));
t('la solution tient dans la limite de flèches',()=>X.LEVELS.forEach(L=>assert.ok(X.solve(L).length<=X.MAX_STEPS)));
t('niveau 1 : droite, droite',()=>assert.equal(X.simulate(X.LEVELS[0],[3,3]).status,'goal'));
t('sortir de la grille = bloqué',()=>assert.equal(X.simulate(X.LEVELS[0],[2]).status,'bump'));
t('foncer dans un rocher = bloqué',()=>assert.equal(X.simulate(X.LEVELS[2],[3,0]).status,'bump'));
t('programme trop court = short',()=>assert.equal(X.simulate(X.LEVELS[0],[3]).status,'short'));
t('rocher bloque',()=>assert.equal(X.simulate(X.LEVELS[4],[3]).status,'bump'));
t('indice après 2 essais ratés',()=>{assert.ok(!X.needsHint(1));assert.ok(X.needsHint(2))});
t('badges',()=>{assert.deepEqual(X.badgesFor({fails:3,hints:1}),['perseverant']);assert.deepEqual(X.badgesFor({fails:0,hints:0}),['observer']);assert.deepEqual(X.finalBadges(5),['coder'])});
console.log(n+' tests réussis');
}
console.log('\n== mon-humeur-du-jour ==');{
const fs=require('fs'),assert=require('assert');
const h=fs.readFileSync(path.join(__dirname,'..','games','mon-humeur-du-jour.html'),'utf8');
const code=h.split('// LOGIC-START')[1].split('// LOGIC-END')[0];
const X=new Function(code+';return{EMOTIONS,HELPERS,helpersFor,validIntensity,dayKey,addEntry,lastDays};')();
let n=0;const t=(m,f)=>{f();n++;console.log('ok -',m)};
t('6 émotions, 3 aides chacune',()=>{assert.equal(X.EMOTIONS.length,6);X.EMOTIONS.forEach(e=>assert.equal(X.helpersFor(e).length,3))});
t('émotion inconnue = aucune aide',()=>assert.deepEqual(X.helpersFor('xyz'),[]));
t('intensité valide seulement 1 à 3',()=>{assert.ok(X.validIntensity(1)&&X.validIntensity(3));assert.ok(!X.validIntensity(0)&&!X.validIntensity(4)&&!X.validIntensity('2'))});
t('format de date',()=>assert.equal(X.dayKey(new Date(2026,9,23)),'2026-10-23'));
t('une seule entrée par jour (la dernière remplace)',()=>{let l=X.addEntry([],{d:'2026-10-23',e:'joy',i:1});l=X.addEntry(l,{d:'2026-10-23',e:'sad',i:2});assert.equal(l.length,1);assert.equal(l[0].e,'sad')});
t('entrées triées par date',()=>{let l=X.addEntry([],{d:'2026-10-24',e:'joy',i:1});l=X.addEntry(l,{d:'2026-10-22',e:'sad',i:2});assert.deepEqual(l.map(x=>x.d),['2026-10-22','2026-10-24'])});
t('entrée invalide refusée',()=>{assert.equal(X.addEntry([],{d:'2026-10-23',e:'zzz',i:1}).length,0);assert.equal(X.addEntry([],{d:'2026-10-23',e:'joy',i:9}).length,0)});
t('maximum 30 entrées',()=>{let l=[];for(let i=1;i<=40;i++)l=X.addEntry(l,{d:'2026-01-'+String(i).padStart(2,'0'),e:'joy',i:1});assert.equal(l.length,30)});
t('lastDays renvoie les 7 derniers',()=>assert.deepEqual(X.lastDays([1,2,3,4,5,6,7,8,9],7),[3,4,5,6,7,8,9]));
console.log(n+' tests réussis');
}
console.log('\n== ma-journee-dans-lordre ==');{
const fs=require('fs'),assert=require('assert');
const h=fs.readFileSync(path.join(__dirname,'..','games','ma-journee-dans-lordre.html'),'utf8');
const code=h.split('// LOGIC-START')[1].split('// LOGIC-END')[0];
const X=new Function(code+';return{ROUT,buildOrder,checkOrder,isSolved,firstFree,needsHint,badgesFor,finalBadges};')();
let n=0;const t=(m,f)=>{f();n++;console.log('ok -',m)};
t('5 routines, 3 à 4 étapes, textes FR+AR présents',()=>{assert.equal(X.ROUT.length,5);X.ROUT.forEach(r=>{assert.ok(r.s.length>=3&&r.s.length<=4);r.t.forEach(x=>assert.ok(x));r.s.forEach(s=>s.forEach(x=>assert.ok(x)))})});
t('le mélange n’est jamais déjà dans l’ordre (200 essais)',()=>{for(let k=1;k<=5;k++)for(let j=0;j<200;j++){const o=X.buildOrder(k);assert.ok(!o.every((v,i)=>v===i));assert.deepEqual(o.slice().sort(),X.ROUT[k-1].s.map((_,i)=>i))}});
t('checkOrder : bon ordre',()=>assert.ok(X.isSolved(X.checkOrder([0,1,2]))));
t('checkOrder : positions fausses détectées',()=>assert.deepEqual(X.checkOrder([0,2,1]),[true,false,false]));
t('un ordre incomplet n’est pas résolu',()=>assert.ok(!X.isSolved(X.checkOrder([0,null,2]))));
t('firstFree',()=>{assert.equal(X.firstFree([0,null,null]),1);assert.equal(X.firstFree([0,1,2]),-1)});
t('indice et badges',()=>{assert.ok(!X.needsHint(1)&&X.needsHint(2));assert.deepEqual(X.badgesFor({fails:3}),['perseverant']);assert.deepEqual(X.badgesFor({fails:0}),['observer']);assert.deepEqual(X.finalBadges(5),['routine'])});
console.log(n+' tests réussis');
}
console.log('\n== la-boite-a-compliments ==');{
const fs=require('fs'),assert=require('assert');
const h=fs.readFileSync(path.join(__dirname,'..','games','la-boite-a-compliments.html'),'utf8');
const code=h.split('// LOGIC-START')[1].split('// LOGIC-END')[0];
const X=new Function(code+';return{KEYS,toggleSelect,addCounts,cleanCounts,totalStars,MAX_PICK};')();
let n=0;const t=(m,f)=>{f();n++;console.log('ok -',m)};
t('8 forces',()=>assert.equal(X.KEYS.length,8));
t('chaque force a un texte FR et AR (extrait du fichier)',()=>{const q=new Function(h.split('const Q={')[1].split('const T={')[0].replace(/^/,'return {').replace(/;\s*$/,''))();X.KEYS.forEach(k=>{assert.ok(q[k]);assert.equal(q[k].length,3);q[k][1].concat(q[k][2]).forEach(s=>assert.ok(s))})});
t('sélection ajoute puis retire',()=>{let s=X.toggleSelect([],'courage',3);assert.deepEqual(s,['courage']);s=X.toggleSelect(s,'courage',3);assert.deepEqual(s,[])});
t('maximum 3 forces',()=>{let s=[];['courage','calm','help','humor'].forEach(k=>s=X.toggleSelect(s,k,3));assert.deepEqual(s,['courage','calm','help'])});
t('désélectionner reste possible quand c’est plein',()=>assert.deepEqual(X.toggleSelect(['courage','calm','help'],'calm',3),['courage','help']));
t('clé inconnue ignorée',()=>assert.deepEqual(X.toggleSelect([],'zzz',3),[]));
t('addCounts cumule sans modifier l’original',()=>{const o={courage:1};const r=X.addCounts(o,['courage','calm']);assert.deepEqual(r,{courage:2,calm:1});assert.deepEqual(o,{courage:1})});
t('cleanCounts élimine les valeurs invalides',()=>{assert.deepEqual(X.cleanCounts({courage:2,calm:'x',zzz:5,help:-1,humor:5000}),{courage:2,humor:999});assert.deepEqual(X.cleanCounts(null),{})});
t('totalStars',()=>assert.equal(X.totalStars({courage:2,calm:1}),3));
console.log(n+' tests réussis');
}
console.log('\n== trouve-lombre ==');{
const fs=require('fs'),assert=require('assert');
const h=fs.readFileSync(path.join(__dirname,'..','games','trouve-lombre.html'),'utf8');
const code=h.split('// LOGIC-START')[1].split('// LOGIC-END')[0];
const X=new Function(code+';return{ROUNDS,SIMILAR,DISTINCT,buildRound,isRight,needsHint,badgesFor,finalBadges,TOTAL_LEVELS};')();
let n=0;const t=(m,f)=>{f();n++;console.log('ok -',m)};
t('6 manches, 2 à 4 choix croissants',()=>{assert.equal(X.TOTAL_LEVELS,6);assert.deepEqual(X.ROUNDS.map(r=>r.k),[2,3,3,4,4,4])});
t('bon nombre de choix, sans doublon, cible incluse (300 tirages/manche)',()=>{for(let k=1;k<=6;k++)for(let j=0;j<300;j++){const r=X.buildRound(k);assert.equal(r.choices.length,X.ROUNDS[k-1].k);assert.equal(new Set(r.choices).size,r.choices.length);assert.ok(r.choices.includes(r.target))}});
t('manches « ressemblantes » : tous les choix viennent d’un même groupe',()=>{for(const k of [3,5,6])for(let j=0;j<200;j++){const r=X.buildRound(k);assert.ok(X.SIMILAR.some(g=>r.choices.every(c=>g.includes(c))))}});
t('manches « distinctes » : choix issus de la liste',()=>{for(const k of [1,2,4])for(let j=0;j<200;j++)X.buildRound(k).choices.forEach(c=>assert.ok(X.DISTINCT.includes(c)))});
t('isRight',()=>{const r={target:'🐘',choices:['🐘','🐟']};assert.ok(X.isRight(r,'🐘'));assert.ok(!X.isRight(r,'🐟'))});
t('indice et badges',()=>{assert.ok(!X.needsHint(1)&&X.needsHint(2));assert.deepEqual(X.badgesFor({errors:3}),['perseverant']);assert.deepEqual(X.badgesFor({errors:0}),['observer']);assert.deepEqual(X.finalBadges(6),['detective']);assert.deepEqual(X.finalBadges(5),[])});
console.log(n+' tests réussis');
}
console.log('\n== compte-les-objets ==');{
const fs=require('fs'),assert=require('assert');
const h=fs.readFileSync(path.join(__dirname,'..','games','compte-les-objets.html'),'utf8');
const code=h.split('// LOGIC-START')[1].split('// LOGIC-END')[0];
const X=new Function(code+';return{COUNT_MAX,CHOICES,buildCount,isRight,needsHint,badgesFor,finalBadges,TOTAL_LEVELS};')();
let n=0;const t=(m,f)=>{f();n++;console.log('ok -',m)};
t('6 manches, nombres jusqu’à 10',()=>{assert.equal(X.TOTAL_LEVELS,6);assert.equal(Math.max(...X.COUNT_MAX),10)});
t('cible dans les bornes de la manche (500 tirages)',()=>{for(let k=1;k<=6;k++)for(let j=0;j<500;j++){const r=X.buildCount(k);assert.ok(r.target>=1&&r.target<=X.COUNT_MAX[k-1])}});
t('bon nombre de choix, uniques, entre 1 et 10, cible incluse',()=>{for(let k=1;k<=6;k++)for(let j=0;j<500;j++){const r=X.buildCount(k);assert.equal(r.choices.length,X.CHOICES[k-1]);assert.equal(new Set(r.choices).size,r.choices.length);assert.ok(r.choices.includes(r.target));r.choices.forEach(c=>assert.ok(c>=1&&c<=10))}});
t('isRight',()=>{const r={target:4,choices:[4,5]};assert.ok(X.isRight(r,4)&&!X.isRight(r,5))});
t('indice et badges',()=>{assert.ok(!X.needsHint(1)&&X.needsHint(2));assert.deepEqual(X.badgesFor({errors:3}),['perseverant']);assert.deepEqual(X.badgesFor({errors:0}),['observer']);assert.deepEqual(X.finalBadges(6),['counter'])});
console.log(n+' tests réussis');
}
console.log('\n== les-lettres ==');{
const fs=require('fs'),assert=require('assert');
const h=fs.readFileSync(path.join(__dirname,'..','games','les-lettres.html'),'utf8');
const code=h.split('// LOGIC-START')[1].split('// LOGIC-END')[0];
const X=new Function(code+';return{WORDS,FR,AR,CHOICES,buildDeck,buildRound,isRight,needsHint,badgesFor,finalBadges,TOTAL_LEVELS};')();
let n=0;const t=(m,f)=>{f();n++;console.log('ok -',m)};
t('8 mots complets (emoji, FR, lettre FR, AR, lettre AR)',()=>{assert.equal(X.WORDS.length,8);X.WORDS.forEach(w=>{assert.equal(w.length,5);w.forEach(x=>assert.ok(x))})});
t('la lettre indiquée est bien la première lettre du mot',()=>X.WORDS.forEach(w=>{assert.equal(w[1][0].toUpperCase(),w[2]);assert.equal(w[3][0],w[4])}));
t('chaque lettre cible existe dans l’alphabet',()=>X.WORDS.forEach(w=>{assert.ok(X.FR.includes(w[2]));assert.ok(X.AR.includes(w[4]))}));
t('paquet : 6 mots différents',()=>{for(let j=0;j<200;j++){const d=X.buildDeck();assert.equal(d.length,6);assert.equal(new Set(d).size,6)}});
t('manches FR et AR : bon nombre de choix, uniques, lettre juste incluse',()=>{for(const lang of ['fr','ar'])for(let k=1;k<=6;k++)for(let wi=0;wi<8;wi++)for(let j=0;j<50;j++){const r=X.buildRound(k,lang,wi);assert.equal(r.choices.length,X.CHOICES[k-1]);assert.equal(new Set(r.choices).size,r.choices.length);assert.ok(r.choices.includes(r.letter));assert.ok(X.isRight(r,r.letter))}});
t('choix du bon alphabet',()=>{const f=X.buildRound(6,'fr',0),a=X.buildRound(6,'ar',0);f.choices.forEach(c=>assert.ok(X.FR.includes(c)));a.choices.forEach(c=>assert.ok(X.AR.includes(c)))});
t('indice et badges',()=>{assert.ok(!X.needsHint(1)&&X.needsHint(2));assert.deepEqual(X.badgesFor({errors:3}),['perseverant']);assert.deepEqual(X.badgesFor({errors:0}),['observer']);assert.deepEqual(X.finalBadges(6),['letters'])});
console.log(n+' tests réussis');
}
console.log('\n== menu-accueil ==');{
const fs=require('fs'),assert=require('assert');
const h=fs.readFileSync(path.join(__dirname,'..','games','menu-accueil.html'),'utf8');
const code=h.split('// LOGIC-START')[1].split('// LOGIC-END')[0];
const X=new Function(code+';return{GAMES,GROUPS,AVATARS,IDS,cleanVisited,markVisited,cleanProfile};')();
let n=0;const t=(m,f)=>{f();n++;console.log('ok -',m)};
t('9 jeux, ids uniques',()=>{assert.equal(X.GAMES.length,9);assert.equal(new Set(X.IDS).size,9)});
t('chaque jeu a un lien d’artefact, un emoji, une couleur et des textes FR+AR',()=>X.GAMES.forEach(g=>{assert.match(g.u,/^[a-z-]+\.html$/);assert.ok(require('fs').existsSync(path.join(__dirname,'..','games',g.u)),'fichier manquant : '+g.u);assert.ok(g.e&&g.c);assert.equal(g.fr.length,2);assert.equal(g.ar.length,2);g.fr.concat(g.ar).forEach(x=>assert.ok(x))}));
t('liens tous différents',()=>assert.equal(new Set(X.GAMES.map(g=>g.u)).size,9));
t('chaque jeu appartient à un groupe existant, aucun groupe vide',()=>{X.GAMES.forEach(g=>assert.ok(g.g>=0&&g.g<X.GROUPS.length));X.GROUPS.forEach((_,i)=>assert.ok(X.GAMES.some(g=>g.g===i)))});
t('markVisited : ajoute sans doublon, ignore les inconnus',()=>{let v=X.markVisited([],'robot');v=X.markVisited(v,'robot');assert.deepEqual(v,['robot']);assert.deepEqual(X.markVisited(v,'zzz'),['robot'])});
t('cleanVisited nettoie',()=>{assert.deepEqual(X.cleanVisited(['robot','robot','x',3]),['robot']);assert.deepEqual(X.cleanVisited('abc'),[])});
t('cleanProfile : retire les caractères HTML, limite à 12, avatar par défaut',()=>{const p=X.cleanProfile({a:'💥',n:'<b>Sami</b>&"\'` trop long du tout'});assert.equal(p.a,X.AVATARS[0]);assert.ok(!/[<>&"'`]/.test(p.n));assert.ok(p.n.length<=12);assert.equal(X.cleanProfile(null),null);assert.equal(X.cleanProfile({a:'🦊',n:'Lina'}).n,'Lina')});
console.log(n+' tests réussis');
}
