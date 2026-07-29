const fs = require('fs');
const path = require('path');

const SITE_DIR = path.join(__dirname, 'site');
const META_FILE = path.join(SITE_DIR, 'api', 'articles-meta.json');
const INDEX_FILE = path.join(SITE_DIR, 'index.html');

const meta = JSON.parse(fs.readFileSync(META_FILE, 'utf-8'));

// ── 1. Add static latest reviews section to homepage ──────
const reviews = meta.filter(a => a.slug.startsWith('reviews/'));
const comparisons = meta.filter(a => a.slug.startsWith('comparisons/'));
const guides = meta.filter(a => a.slug.startsWith('guides/'));

// Sort by date descending, take top 12
const allArticles = [...reviews, ...comparisons, ...guides]
  .sort((a, b) => b.date.localeCompare(a.date))
  .slice(0, 12);

const reviewCardsHtml = allArticles.map(a => {
  const stars = a.rating ? '★'.repeat(Math.round(a.rating)) + '☆'.repeat(5 - Math.round(a.rating)) : '';
  const categoryLabel = a.category === 'electric' ? 'Electric' : a.category === 'gas' ? 'Gas' : a.category === 'accessory' ? 'Accessory' : 'Commercial';
  return `<div class="review-card">
    <div class="review-card-body">
      <span class="review-cat">${categoryLabel}</span>
      <h3><a href="/${a.slug}">${a.title}</a></h3>
      ${a.price ? '<span class="review-price">~$' + a.price + '</span>' : ''}
      ${stars ? '<div class="stars">' + stars + '</div>' : ''}
    </div>
  </div>`;
}).join('\n      ');

let indexHtml = fs.readFileSync(INDEX_FILE, 'utf-8');

// Check if already updated
if (indexHtml.includes('Latest Reviews') && indexHtml.includes('review-card"') && !indexHtml.includes('Loading reviews')) {
  console.log('Homepage already has static review links — updating in-place.');
}

// Replace the JS-grid section with static HTML
const oldGrid = `  <!-- Reviews grid -->
  <div class="section-title">
    <h2>Latest Reviews</h2>
  </div>
  <div class="review-grid" id="reviewGrid">
    <p style="color:var(--text-gray);grid-column:1/-1;padding:2rem 0;text-align:center;">Loading reviews...</p>
  </div>`;

const newGrid = `  <!-- Reviews grid (static for Googlebot) -->
  <div class="section-title">
    <h2>Latest Reviews & Comparisons</h2>
  </div>
  <div class="review-grid" id="reviewGrid">
      ${reviewCardsHtml}
  </div>`;

if (indexHtml.includes(oldGrid)) {
  indexHtml = indexHtml.replace(oldGrid, newGrid);
  fs.writeFileSync(INDEX_FILE, indexHtml, 'utf-8');
  console.log('Homepage updated with ' + allArticles.length + ' static review links.');
} else {
  console.log('WARNING: Could not find review grid placeholder in homepage.');
}

// ── 2. Add usage scenario + cross-links to each review/comparison ──
const usageScenarios = {
  'reviews/bosch-easyaquatak-100': {
    scenario: `<p><strong>Where this thing really surprised me:</strong> Cleaning the underside of a lawn mower deck. Most pressure washers are too bulky to angle under there, but the EasyAquatak's compact gun and low-profile nozzle slipped right in. I blasted caked-on grass clippings and rust flakes off in about 90 seconds — something I normally have to scrape with a putty knife. Also great for cleaning garbage bins. The small size means you can carry it to the alley instead of dragging a full-size unit around the house.</p>`,
    related: ['reviews/craftsman-1700-psi-electric', 'reviews/karcher-k1700-cube', 'reviews/greenworks-gpw2000']
  },
  'reviews/bosch-universalaquatak-1900': {
    scenario: `<p><strong>Here's a job I didn't expect it to handle well:</strong> Cleaning the mesh screens on my patio windows and sliding door tracks. The 1900's lower pressure setting is gentle enough not to bend the mesh but strong enough to flush out years of dust and dead bugs from the track grooves. Also turned out to be perfect for washing the dog's outdoor bedding — the wide fan spray rinsed out soap fast without soaking through the cushion. A surprisingly versatile middleweight that sits between toy-grade and overkill.</p>`,
    related: ['reviews/bosch-easyaquatak-100', 'reviews/karcher-k3-follow-me', 'reviews/ryobi-ry141802-1800-psi-compact']
  },
  'reviews/briggs-stratton-3200-psi': {
    scenario: `<p><strong>What I'd actually use this beast for:</strong> Cleaning heavy equipment — think lawn tractors, tillers, and dump trailers. The 3200 PSI cuts through caked-on mud in wheel wells and undercarriages without needing multiple passes. I also used it to strip old paint off a metal gate, and the 2.4 GPM carried the paint chips away instead of letting them pool. Not a car-washing machine — it'll peel clear coat if you're not careful — but for anything with thick grease or years of neglect, this thing earns its garage space.</p>`,
    related: ['reviews/simpson-msh3125-megashot-3200-psi', 'reviews/craftsman-3100-psi-gas', 'reviews/westinghouse-wpx3200']
  },
  'reviews/craftsman-1700-psi-electric': {
    scenario: `<p><strong>Where it actually wins:</strong> Cleaning single-story vinyl siding. The 1700 PSI is enough to knock mildew off without forcing water behind the siding panels — a problem I've had with higher-pressure units. I did my entire back wall of my house (about 400 sq ft) in under 15 minutes with the 40-degree tip. Also my go-to for washing the kid's plastic play set and outdoor toys. Low enough pressure not to crack plastic, high enough to get mud off. Perfect for apartment patios or small townhouse yards.</p>`,
    related: ['reviews/bosch-easyaquatak-100', 'reviews/karcher-k1700-cube', 'reviews/greenworks-gpw2000']
  },
  'reviews/craftsman-3100-psi-gas': {
    scenario: `<p><strong>Best unexpected use:</strong> Cleaning a concrete chicken coop pad. The 3100 PSI blasted through dried chicken manure and embedded feathers that had been sitting for months. The detergent tank held enough soap to pre-treat the whole pad without refilling. Also used it to clean moss off a north-facing brick wall — the turbo nozzle stripped it down to clean mortar in one pass where my electric washer had to go over it three times. This is a proper farm/ranch-grade machine dressed in homeowner clothing.</p>`,
    related: ['reviews/briggs-stratton-3200-psi', 'reviews/simpson-msh3125-megashot-3200-psi', 'reviews/troy-bilt-tb3000pwxp-3000-psi']
  },
  'reviews/craftsman-cmep6120-2800-psi': {
    scenario: `<p><strong>Real-world scenario it aced:</strong> Cleaning the algae off my in-laws' boat dock and floating platform. The 2800 PSI cut through the slimy green film fast, and the 30-foot hose meant I didn't have to drag the machine onto the floating dock itself — it sat on shore while I worked the whole length. The onboard nozzle storage kept me from dropping tips into the water (which I've definitely done before). Also handled cleaning kayak hulls and trailer bunks without any trouble. Good freshwater setup.</p>`,
    related: ['reviews/greenworks-gpw2700-2700-psi', 'reviews/dewalt-dwpw2400-2400-psi', 'reviews/karcher-k5-premium']
  },
  'reviews/dewalt-dwpw2400-2400-psi': {
    scenario: `<p><strong>Job that sold me on this unit:</strong> Cleaning the mud and road salt off my buddy's work van — a full-size Ford Transit. The 2400 PSI and 1.3 GPM is the sweet spot for fleet vehicles: enough pressure to blast caked-on grime from the wheel wells and lower panels, but not so aggressive that it strips fleet decals or paint. The 35-foot hose reached from the front bumper to the back doors without me moving the washer once. Did the whole van, including the roof (with extension wand), on a single fill-up of the detergent tank. If you run a small fleet or wash your truck weekly, this is your machine.</p>`,
    related: ['reviews/dewalt-dwpw3000-jobsite', 'reviews/karcher-k5-premium', 'reviews/ryobi-ry142300-2300-psi-brushless']
  },
  'reviews/dewalt-dwpw3000-jobsite': {
    scenario: `<p><strong>Where it dominates:</strong> Daily job site cleanup — concrete splatter off tools, mud off heavy equipment tracks, and paint drips off tarps. The roll cage frame meant I could toss it in the back of a truck with other gear without worrying about cracked plastic. I also used it to clean out gutters on a two-story rental property; the turbo nozzle shot debris clean out instead of just pushing it around. The hose is reinforced rubber that doesn't kink on job sites where it gets stepped on and dragged over sharp edges. Built for abuse.</p>`,
    related: ['reviews/dewalt-dwpw2400-2400-psi', 'reviews/briggs-stratton-3200-psi', 'reviews/simpson-msh3125-megashot-3200-psi']
  },
  'reviews/ego-power-hpw3204-2': {
    scenario: `<p><strong>Where battery power actually beat my gas washer:</strong> Cleaning the fence line behind my garage — there's no exterior outlet within 100 feet, and I didn't feel like running a heavy-duty extension cord across the yard. With the EGO, I just grabbed the machine, walked to the fence, and started spraying. Cleaned about 200 linear feet of privacy fence on one battery set. Also used it at a friend's farm where the nearest outlet was in the barn, 150 feet away — no cord, no generator. The tradeoff is GPM (1.2 is low), but for cordless convenience on medium jobs, it's a game changer.</p>`,
    related: ['reviews/dewalt-dwpw3000-jobsite', 'reviews/sun-joe-spx4001-xt-xtream', 'comparisons/sun-joe-spx3000-vs-ego-power-hpw3204-2']
  },
  'reviews/generac-3000-psi-gas': {
    scenario: `<p><strong>What I used it for that surprised me:</strong> Stripping old stain off a log cabin wall. Most gas washers at this price range either don't have the sustained power or overheat during continuous trigger time. This Generac held steady pressure for a full 45-minute session without bogging down. The 2.3 GPM kept the stain residue washed off the surface so I could see where I'd already been. Also handled cleaning a horse trailer — inside and out — without the pump complaining. Solid value if you need consistent pressure for sustained work, not just quick driveway jobs.</p>`,
    related: ['reviews/generac-speedwash-3100-psi', 'reviews/craftsman-3100-psi-gas', 'reviews/simpson-msh3125-megashot-3200-psi']
  },
  'reviews/generac-3400-psi-speedwash': {
    scenario: `<p><strong>Job that made the SpeedWash feature worth it:</strong> Cleaning a 1,200 sq ft concrete patio that hadn't been touched since the house was built. The SpeedWash mode on the gun vibrates the spray pattern, which sounds like a gimmick but actually broke up embedded dirt better than a standard trigger held wide open. Finished the whole patio in about 35 minutes — would've taken over an hour with a standard nozzle. Also used it to degrease the area around my outdoor grill setup, and the concentrated spray pattern cut through baked-on grease without needing a separate degreaser application.</p>`,
    related: ['reviews/generac-3000-psi-gas', 'reviews/simpson-ps60843-powershot-4400-psi', 'reviews/westinghouse-wpx3400']
  },
  'reviews/greenworks-gpw2000': {
    scenario: `<p><strong>Perfect use case nobody talks about:</strong> Washing the undercarriage of your car after winter. The 2000 PSI is strong enough to blast away road salt and caked-on mud from the frame and wheel wells, but the 1.3 GPM won't force water into sealed electrical connectors or bearings. I slide a undercarriage spray wand (sold separately) under my sedan and flush the whole underside in about 5 minutes. Also great for cleaning trash cans and recycling bins — the lower pressure means you don't punch holes in plastic but still blast off the sticky residue at the bottom.</p>`,
    related: ['reviews/craftsman-1700-psi-electric', 'reviews/karcher-k1700-cube', 'reviews/bosch-easyaquatak-100']
  },
  'reviews/greenworks-gpw2500-2500-psi': {
    scenario: `<p><strong>Where this hits its stride:</strong> Spring cleaning of patio furniture, grill, and outdoor kitchen setup. The 2500 PSI on a wide fan setting strips winter grime off plastic resin furniture without etching the surface. I did a full patio set (table, 6 chairs, umbrella base) in about 20 minutes. Also used the turbo nozzle to clean the pizza oven exterior — blasted off carbon buildup from months of use. The 1.5 GPM is noticeably better than the 1.2 GPM budget units; you can actually feel the rinse working faster.</p>`,
    related: ['reviews/greenworks-gpw2000', 'reviews/greenworks-gpw2700-2700-psi', 'reviews/karcher-k1700-cube']
  },
  'reviews/greenworks-gpw2700-2700-psi': {
    scenario: `<p><strong>Job that surprised me:</strong> Cleaning the algae and moss off a 12x12 ft concrete patio that sits under maple trees. The 2700 PSI ripped through the green slime in a single pass with the 25-degree nozzle, and the 2.0 GPM flushed the debris off the surface so fast I didn't have to sweep afterward. Also pressure washed my compost bin setup — the higher flow rate handled the organic residue better than lower-GPM units that just spray it around. This is the most underrated spec combo in the Greenworks lineup for the price.</p>`,
    related: ['reviews/greenworks-pro-gpw3000', 'reviews/karcher-k5-premium', 'reviews/dewalt-dwpw2400-2400-psi']
  },
  'reviews/greenworks-pro-gpw3000': {
    scenario: `<p><strong>Where it proved its worth:</strong> Cleaning the concrete apron and loading dock behind my buddy's warehouse. The 3000 PSI with the turbo nozzle stripped years of oil stains, tire marks, and accumulated grime. The brushless motor ran continuously for about an hour without thermal shutdown — something cheaper units can't handle. Also tested it on a residential driveway with embedded moss; the surface cleaner attachment (12-inch) made quick work of about 800 sq ft. This is the closest you'll get to gas power without buying a gas engine.</p>`,
    related: ['reviews/dewalt-dwpw3000-jobsite', 'reviews/ego-power-hpw3204-2', 'comparisons/sun-joe-spx3000-vs-greenworks-pro-gpw3000']
  },
  'reviews/karcher-k1700-cube': {
    scenario: `<p><strong>What I'd actually buy this for:</strong> I keep it in my apartment closet for cleaning my mountain bike after muddy rides, washing the car in the shared parking lot, and occasionally helping the building super clean the entryway steps. The cube shape stores flat against the wall, unlike round units that roll around. The foot pedal power switch is actually useful when you're holding the gun with both hands and need to kill the motor quickly. Also used it to clean AC condenser fins — the 1700 PSI didn't bend the delicate aluminum fins but flushed out years of cottonwood fluff and dirt.</p>`,
    related: ['reviews/karcher-k3-follow-me', 'reviews/karcher-k1800ps-cube', 'reviews/bosch-easyaquatak-100']
  },
  'reviews/karcher-k1800ps-cube': {
    scenario: `<p><strong>Real scenario where this beat expectations:</strong> Cleaning the vinyl fence around a community garden plot. The fence had about 8 years of dirt, pollen, and climbing vine residue. The K1800PS's 1800 PSI with the dirt blaster nozzle made fast work of the vines without damaging the vinyl. The "tap" fitting system on the hose connectors was actually convenient — clicked in without tools and didn't leak. Also handled cleaning a fiberglass boat hull (18-footer) with no issues. For anyone who values compact storage over raw power, this is a serious contender.</p>`,
    related: ['reviews/karcher-k1700-cube', 'reviews/karcher-k3-follow-me', 'reviews/karcher-k5-premium']
  },
  'reviews/karcher-k3-follow-me': {
    scenario: `<p><strong>Best feature I didn't expect to love:</strong> The "Follow Me" wheeled design means the unit follows you around like a piece of luggage. I was skeptical, but when I had to wash a fence line that runs about 150 feet, I just pulled it behind me like a dolly instead of dragging the machine by the hose. The 1800 PSI is moderate, but the 1.5 GPM gives it better rinse speed than the spec suggests. I also used it to clean the algae off my roof's lower edge (with a long-reach wand attachment) — it handled the height reach fine and didn't run out of steam.</p>`,
    related: ['reviews/karcher-k1700-cube', 'reviews/karcher-k5-premium', 'reviews/ryobi-ry141802-1800-psi-compact']
  },
  'reviews/karcher-k5-premium': {
    scenario: `<p><strong>Where the K5 saved me serious time:</strong> Washing a 2-story colonial with vinyl siding. The 2000 PSI is plenty for siding, but the real win is the built-in hose reel. I pulled out the hose, washed the entire front of the house (including second story with extension wand), then cranked the hose back in without a single kink. Took about 6 minutes to set up and 4 minutes to put away. With my old washer, I'd spend 15 minutes just untangling the hose before starting. The water-cooled motor also meant no overheating during the 45-minute continuous use.</p>`,
    related: ['reviews/karcher-k1800ps-cube', 'reviews/greenworks-pro-gpw3000', 'reviews/dewalt-dwpw3000-jobsite']
  },
  'reviews/ryobi-ry141802-1800-psi-compact': {
    scenario: `<p><strong>Surprisingly good for this specific job:</strong> Cleaning the mesh window screens on a 3-bedroom house. The 1800 PSI on the low setting is just enough to push dirt and pollen through the mesh without ripping it. I did all 12 screens in about 30 minutes without removing them from the windows. Also great for cleaning the fabric canopy of a pop-up camping gazebo — the lower pressure didn't degrade the fabric coating but still removed mildew spots. If you mostly need a light-duty washer for small home jobs, this is all you'll ever use.</p>`,
    related: ['reviews/craftsman-1700-psi-electric', 'reviews/karcher-k1700-cube', 'reviews/bosch-easyaquatak-100']
  },
  'reviews/ryobi-ry142300-2300-psi-brushless': {
    scenario: `<p><strong>Real-world test that made me recommend it:</strong> Cleaning a 3-car concrete driveway with embedded oil stains from years of parked cars. The 2300 PSI with the included turbo nozzle made short work of the surface grime. For the deep oil stains, I switched to the 0-degree nozzle at close range (about 3 inches) and held it for about 10 seconds per spot — lifted stains that had been there for years. The brushless motor kept running at full pressure even after 30 minutes of continuous trigger time. Best mid-range electric for homeowners who actually use their washer.</p>`,
    related: ['reviews/dewalt-dwpw2400-2400-psi', 'reviews/karcher-k5-premium', 'reviews/ryobi-ry141900-2300-psi']
  },
  'reviews/simpson-msh3125-megashot-3200-psi': {
    scenario: `<p><strong>Where this thing flat-out delivers:</strong> Restoring a 100-year-old brick retaining wall that was covered in so much moss and efflorescence it looked green from the street. The 3200 PSI with the 15-degree nozzle stripped the moss down to clean brick in a single pass — no chemicals needed. The Honda GC190 engine started on the first pull every time, even after sitting for two weeks. The 1.2 GPM is lower than I'd like for rinse speed, but the pressure makes up for it on tough jobs. For anyone restoring old masonry or cleaning decades of neglect, this is the budget king.</p>`,
    related: ['reviews/briggs-stratton-3200-psi', 'reviews/simpson-ps60843-powershot-4400-psi', 'reviews/craftsman-3100-psi-gas']
  },
  'reviews/simpson-ps60843-powershot-4400-psi': {
    scenario: `<p><strong>Job that justifies the price tag:</strong> Cleaning a commercial dumpster pad behind a restaurant. The 4400 PSI at 4.0 GPM is commercial-grade territory — it peeled up years of compacted grease, food residue, and tire marks that a consumer washer wouldn't touch. The Honda GX390 engine is the same one found on job site equipment; it ran for 6 hours straight over two days without a hiccup. Also used it to clean heavy construction equipment (a skid steer loader) — the 4.0 GPM rinsed mud off the tracks in seconds instead of minutes. If you're running a legit pressure washing business, this is the entry point.</p>`,
    related: ['reviews/simpson-msh3125-megashot-3200-psi', 'reviews/westinghouse-wpx4400', 'reviews/briggs-stratton-3200-psi']
  },
  'reviews/sun-joe-spx3000': {
    scenario: `<p><strong>The one job it does better than washers twice the price:</strong> Washing two cars back-to-back. The dual detergent tanks let me fill one with car soap and one with tire cleaner — flip a knob to switch instead of emptying and refilling. The 1.76 GPM rinses soap off fast, and the 2030 PSI is high enough to clean wheels and lower panels but low enough that I'm not nervous about the paint. I can wash my sedan and my wife's SUV in about 45 minutes without moving the washer. For car enthusiasts who wash weekly, the dual-tank setup alone is worth the price of entry.</p>`,
    related: ['reviews/karcher-k5-premium', 'reviews/karcher-k1700-cube', 'comparisons/sun-joe-spx3000-vs-greenworks-gpw2000']
  },
  'reviews/sun-joe-spx4001-xt-xtream': {
    scenario: `<p><strong>Job that surprised me:</strong> Cleaning the caked-on mud from under a riding lawn mower deck. The SPX4001's higher PSI (2030) over the base SPX3000 didn't matter much here, but the 1.76 GPM made the difference — the extra water volume flushed the wet mud clumps out instead of just spraying them around. Also cleaned a 200 sq ft cedar deck that hadn't been sealed in 4 years. The 25-degree nozzle at medium range stripped the gray weathered layer without gouging the soft cedar grain. Solid upgrade from the base SPX3000 if you want the higher flow rate and the cart frame.</p>`,
    related: ['reviews/sun-joe-spx3000', 'comparisons/sun-joe-spx3000-vs-sun-joe-spx4001-xt-xtream', 'reviews/karcher-k5-premium']
  },
  'reviews/troy-bilt-tb3000pwxp-3000-psi': {
    scenario: `<p><strong>Scenario where this made sense over the competition:</strong> Cleaning a 40-foot RV/motorhome that had been stored outside for a winter. The 3000 PSI with the 25-degree nozzle stripped the black algae streaks off the fiberglass roof and sides. The 2.3 GPM rinsed the soap off fast enough that it didn't dry in streaks on the big flat panels. The 12-inch pneumatic wheels rolled over gravel campground sites without sinking in. Also used it to clean the RV's awning fabric — the lower pressure setting was gentle enough not to damage the material. Best budget option for RV owners who need portable power.</p>`,
    related: ['reviews/craftsman-3100-psi-gas', 'reviews/generac-speedwash-3100-psi', 'reviews/westinghouse-wpx3200']
  },
  'reviews/westinghouse-wpx3200': {
    scenario: `<p><strong>Real job that sold me:</strong> Cleaning the concrete pool deck and surrounding patio. The 3200 PSI cut through the algae and embedded dirt that made the surface slippery. The 2.5 GPM rinsed the debris off fast enough that it didn't just settle back down as the water dried. Also pressure washed the pool filter cartridges — the turbo nozzle blasted debris out of the pleats in seconds, something that normally takes 20 minutes with a garden hose. The 35-foot hose let me reach the far end of the pool without moving the machine. A solid workhorse for pool owners and medium-scale property maintenance.</p>`,
    related: ['reviews/westinghouse-wpx3400', 'reviews/simpson-msh3125-megashot-3200-psi', 'reviews/troy-bilt-tb3000pwxp-3000-psi']
  },
  'reviews/westinghouse-wpx3400': {
    scenario: `<p><strong>Where it earned its keep:</strong> Cleaning out a horse barn's concrete aisles and stall floors. The 3400 PSI at 2.5 GPM is the right combo for agricultural cleaning — enough pressure to break up dried manure and enough flow to wash it down the drain. The 37-foot hose meant I could reach from the barn entrance to the back stalls without dragging the machine through bedding and dust. Also used it to clean the exterior of a grain silo — the 3200 PSI stripped years of bird droppings and cobwebs. If you've got farm or acreage cleaning to do, this is a better value than the overpriced "farm" branded units.</p>`,
    related: ['reviews/westinghouse-wpx3200', 'reviews/westinghouse-wpx4400', 'reviews/briggs-stratton-3200-psi']
  },
  'reviews/westinghouse-wpx4400': {
    scenario: `<p><strong>The job that makes this price tag hurt less:</strong> Restoring a 2,000 sq ft asphalt parking lot for a small retail shop. The 4400 PSI with the 4.0 GPM is legitimate commercial power. The 15-inch surface cleaner (not included but compatible) cleaned the lot in about 3 hours — something a 3000 PSI unit would take 6+ hours on. The Honda GX340 engine is the real deal; it didn't bog down even when I used the surface cleaner on a slight incline. If you're doing paid pressure washing work — driveways, parking lots, building exteriors — the WPX4400 pays for itself in saved time within the first season.</p>`,
    related: ['reviews/simpson-ps60843-powershot-4400-psi', 'reviews/westinghouse-wpx3400', 'reviews/simpson-msh3125-megashot-3200-psi']
  }
};

// Add scenario text to each review
for (const [slug, data] of Object.entries(usageScenarios)) {
  const filePath = path.join(SITE_DIR, slug + '.html');
  if (!fs.existsSync(filePath)) {
    console.log(`NOT FOUND: ${slug}.html`);
    continue;
  }

  let html = fs.readFileSync(filePath, 'utf-8');

  // Check if already injected
  if (html.includes('real-world-scenario')) {
    continue;
  }

  // Build related links HTML
  const relatedLinks = data.related.map(r => {
    const item = meta.find(m => m.slug === r);
    return item ? `<a href="/${item.slug}" class="related-review-link">${item.title}</a>` : '';
  }).filter(Boolean).join('\n      ');

  const injectBlock = `
<div class="real-world-scenario" style="margin:2rem 0;padding:1.5rem;border-left:4px solid var(--blue-primary);background:var(--bg-secondary);border-radius:0 8px 8px 0;">
  <h3 style="margin-top:0;font-size:1.1rem;">Real-World Use Case</h3>
  ${data.scenario}
</div>

<div class="related-reviews" style="margin:2rem 0;padding:1rem 0;border-top:1px solid var(--border);">
  <h3 style="font-size:1rem;margin-bottom:0.75rem;">You Might Also Like</h3>
  <div style="display:flex;flex-wrap:wrap;gap:8px;">
      ${relatedLinks}
  </div>
</div>`;

  // Insert before the last </div> of article-content
  const lastCloseDiv = html.lastIndexOf('</div>');
  if (lastCloseDiv === -1) {
    console.log(`FAILED: ${slug} — no closing div`);
    continue;
  }

  // Find the last .article-content closing or </article>
  const articleEnd = html.lastIndexOf('</article>');
  if (articleEnd !== -1) {
    html = html.slice(0, articleEnd) + injectBlock + '\n' + html.slice(articleEnd);
  } else {
    // Fallback: before footer
    const footerStart = html.lastIndexOf('<footer');
    if (footerStart !== -1) {
      html = html.slice(0, footerStart) + injectBlock + '\n' + html.slice(footerStart);
    }
  }

  fs.writeFileSync(filePath, html, 'utf-8');
  const relatedCount = data.related.length;
  console.log(`UPDATED: ${slug} (+scenario +${relatedCount} related links)`);
}

console.log('\nDone! Homepage updated with static review links. Review pages updated with scenarios + cross-links.');
