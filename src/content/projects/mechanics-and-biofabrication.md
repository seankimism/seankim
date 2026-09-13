---
title: "Mechanics-informed tissue engineering"
description: "Connecting scaffold mechanics, cell behavior, and bioreactor design to the manufacture of engineered tissues."
organization: "Cornell University"
period: "2019–2023"
tags: ["Biomechanics", "Biofabrication", "Finite element analysis", "Bioreactor design"]
order: 3
---

<p class="project-lede">Doctoral research in <a href="https://bonassar.research.engineering.cornell.edu/">Lawrence Bonassar's lab</a> at Cornell, spanning experimental mechanics, finite element modeling, implant design, and automated bioreactor development. Everything on this page comes from my dissertation and the collaborations that grew out of it.</p>

## The thread through this work

Engineered tissues are built, matured, and implanted under mechanical load, and cells never experience the load that a test frame reports. They experience whatever the structure around them does with it. My work followed that gap between global and local mechanics through three systems: porous collagen scaffolds for cartilage, biological intervertebral disc implants, and the bioreactors used to manufacture engineered tissue.

The practical outcome is a set of non-destructive indicators of construct readiness. Manufacturers currently judge engineered cartilage by destroying samples from each batch; the local failures and compositional thresholds identified below point to what could be monitored instead.

<p class="dissertation-note">Dissertation: <em>Mechanically Informed Design Controls for Tissue Engineered Cartilage Biofabrication: Importance of Micro Failure, Architecture, and Composition</em>, Cornell University, 2023.</p>

<div class="arc-list">
  <div class="arc-row"><span class="arc-number">01</span><div><h3>Local mechanics decide cell fate</h3><p>Buckling instabilities, densification, and compositional thresholds concentrate strain at the microscale. Those local failures, not the bulk strain, govern chondrocyte viability and where engineered tissue is overloaded.</p></div></div>
  <div class="arc-row"><span class="arc-number">02</span><div><h3>Fit and support decide implant performance</h3><p>For biological disc implants, anatomic variation and placement set the loads, and a flexible bioabsorbable support holds disc height while tissue forms.</p></div></div>
  <div class="arc-row"><span class="arc-number">03</span><div><h3>Systems decide reproducibility</h3><p>Cell source sets the floor on construct-to-construct variability, local composition can serve as a non-destructive quality-control readout, and a closed, automated bioreactor standardizes the mechanical conditioning that manufacturing depends on.</p></div></div>
</div>

## Local mechanics and cell fate

Fast confocal microscopy with digital image correlation made it possible to map strain inside scaffolds and tissues while they were loaded, at the scale of the cells living in them. That measurement runs through this arc, from empty scaffolds to living tissue.

<div class="paper-list">
  <article class="paper-card">
    <a class="paper-card-figure" href="https://doi.org/10.1007/s11340-022-00853-7" target="_blank" rel="noopener noreferrer"><img src="/cornell/collagen-scaffold-buckling.png" alt="Compressive stress–strain curve of a honeycomb collagen scaffold with confocal images at four points along it: undeformed columnar pores, first buckling at the end of the linear region, local collapse bands forming, and a global collapse band with densification." loading="lazy" decoding="async" /></a>
    <div class="paper-card-body">
      <p class="eyebrow">Experimental Mechanics · 2022</p>
      <h3><a href="https://doi.org/10.1007/s11340-022-00853-7" target="_blank" rel="noopener noreferrer">The role of buckling instabilities in the global and local mechanical response in porous collagen scaffolds</a></h3>
      <p>Confined compression and confocal strain mapping of honeycomb and sponge collagen scaffolds showed that both follow the cellular-solid pattern of linear, plateau, and densification regions, and that the plateau is driven by local instabilities such as snap-through buckling. The two architectures were indistinguishable in bulk but distinct at the microscale: honeycomb scaffolds strained evenly through their depth, while sponge scaffolds collapsed at their boundaries.</p>
      <p class="paper-card-links"><a href="/publications/collagen-scaffold-buckling/">Publication details</a></p>
    </div>
  </article>
  <article class="paper-card">
    <a class="paper-card-figure" href="https://doi.org/10.1101/2024.06.18.599620" target="_blank" rel="noopener noreferrer"><img src="/cornell/collagen-scaffold-auxetic-behavior.jpg" alt="Micro-CT reconstructions of a honeycomb collagen scaffold at six compressive strains from 0 to 40 percent, with mid-height and transverse cross-sections showing the outline contracting inward as walls buckle, and two highlighted cells that fold progressively." loading="lazy" decoding="async" /></a>
    <div class="paper-card-body">
      <p class="eyebrow">bioRxiv preprint · 2024</p>
      <h3><a href="https://doi.org/10.1101/2024.06.18.599620" target="_blank" rel="noopener noreferrer">3D in-situ characterization reveals the instability-induced auxetic behavior of collagen scaffolds for tissue engineering</a></h3>
      <p>In-situ micro-CT of the same scaffolds during compression showed that the strut instabilities also make them auxetic: they contract laterally as they are compressed. The effect concentrates at the edges of a construct, exactly where an implant has to integrate with native cartilage, so an exotic-sounding bulk property becomes a practical risk of a gap at the interface.</p>
      <p class="paper-card-links"><a href="/publications/collagen-scaffold-auxetic-behavior/">Publication details</a></p>
    </div>
  </article>
  <article class="paper-card">
    <a class="paper-card-figure" href="https://doi.org/10.1016/j.jbiomech.2023.111591" target="_blank" rel="noopener noreferrer"><img src="/cornell/chondrocyte-viability-scaffold-instabilities.jpg" alt="Two rows of confocal images for the isotropic and orthotropic planes of a cell-seeded collagen scaffold at 30 percent bulk strain: the deformed scaffold with buckled walls, the local axial strain map, and the live/dead image showing dead cells where deformation was highest." loading="lazy" decoding="async" /></a>
    <div class="paper-card-body">
      <p class="eyebrow">Journal of Biomechanics · 2023</p>
      <h3><a href="https://doi.org/10.1016/j.jbiomech.2023.111591" target="_blank" rel="noopener noreferrer">Instabilities induced by mechanical loading determine the viability of chondrocytes grown on porous scaffolds</a></h3>
      <p>Chondrocytes seeded on honeycomb and sponge scaffolds were compressed while local strain and cell death were mapped together. Cell death stayed at control levels where the scaffold deformed elastically, trended upward where walls buckled, and jumped where the scaffold densified; loading orientation mattered more than scaffold type, which makes aligning the scaffold with the in vivo load a design lever for keeping cells alive.</p>
      <p class="paper-card-links"><a href="/publications/chondrocyte-viability-scaffold-instabilities/">Publication details</a></p>
    </div>
  </article>
  <article class="paper-card">
    <a class="paper-card-figure" href="https://doi.org/10.1007/978-3-031-25588-5_2" target="_blank" rel="noopener noreferrer"><img src="/cornell/physical-stimuli-chondrocyte-behavior.jpg" alt="Schematic of microscale cartilage mechanobiology: a loading stage on a microscope objective, a confocal image of stained chondrocytes, strain-norm and shear-strain maps of the tissue, and a plot relating microscale physical stimuli to chondrocyte response." loading="lazy" decoding="async" /></a>
    <div class="paper-card-body">
      <p class="eyebrow">Book chapter · Electromechanobiology of Cartilage and Osteoarthritis · 2023</p>
      <h3><a href="https://doi.org/10.1007/978-3-031-25588-5_2" target="_blank" rel="noopener noreferrer">Understanding the influence of local physical stimuli on chondrocyte behavior</a></h3>
      <p>A review of five decades of chondrocyte mechanobiology: how static, dynamic, and injurious loading translate into the stimuli chondrocytes actually sense, including matrix deformation, interstitial fluid flow, hydrostatic pressure, and physicochemical change, and how the field moved from bulk biosynthesis assays to real-time confocal imaging of individual cells.</p>
      <p class="paper-card-links"><a href="/publications/physical-stimuli-chondrocyte-behavior/">Publication details</a></p>
    </div>
  </article>
  <article class="paper-card">
    <a class="paper-card-figure" href="https://doi.org/10.1016/j.actbio.2021.07.003" target="_blank" rel="noopener noreferrer"><img src="/cornell/cartilage-manufacturing-reproducibility.png" alt="Histograms and per-source box plots of aggregate modulus and hydraulic permeability for human tissue-engineered cartilage from seven chondrocyte sources labeled A to G, with aggregate modulus spanning roughly 10 to 1000 kilopascals between sources." loading="lazy" decoding="async" /></a>
    <div class="paper-card-body">
      <p class="eyebrow">Acta Biomaterialia · 2021</p>
      <h3><a href="https://doi.org/10.1016/j.actbio.2021.07.003" target="_blank" rel="noopener noreferrer">The influence of chondrocyte source on the manufacturing reproducibility of human tissue engineered cartilage</a></h3>
      <p>More than 200 human tissue-engineered cartilage constructs from seven chondrocyte sources were tested in compression, friction, and shear. Compressive properties varied by orders of magnitude with the cell source and friction by fivefold while shear modulus did not change, and the depth-dependent strain fields varied with source too, so compression and local mechanics are the properties worth measuring for manufacturing reproducibility.</p>
      <p class="paper-card-links"><a href="/publications/cartilage-manufacturing-reproducibility/">Publication details</a></p>
    </div>
  </article>
  <article class="paper-card">
    <a class="paper-card-figure" href="https://doi.org/10.1016/j.jbiomech.2023.111882" target="_blank" rel="noopener noreferrer"><img src="/cornell/osteochondral-strain-concentrations.png" alt="Six panels plotting local compressive strain, shear strain, and strain norm of engineered cartilage spheroids against local aggrecan and collagen concentration, with sigmoidal fits showing sharp compositional thresholds for static and perfusion-cultured constructs." loading="lazy" decoding="async" /></a>
    <div class="paper-card-body">
      <p class="eyebrow">Journal of Biomechanics · 2024</p>
      <h3><a href="https://doi.org/10.1016/j.jbiomech.2023.111882" target="_blank" rel="noopener noreferrer">Microscale strain concentrations in tissue-engineered osteochondral implants are dictated by local compositional thresholds and architecture</a></h3>
      <p>In osteochondral implants grown by fusing mesenchymal stem cell bodies onto trabecular bone, confocal strain mapping and infrared composition maps showed strain concentrating at the boundaries between poorly integrated spheroids, where aggrecan was low and collagen high. Compressive strain rose more than threefold below a sharp aggrecan threshold, so local composition is both the driver of the micromechanical environment and a candidate quality-control parameter for manufacturing.</p>
      <p class="paper-card-links"><a href="/publications/osteochondral-strain-concentrations/">Publication details</a></p>
    </div>
  </article>
  <article class="paper-card">
    <a class="paper-card-figure" href="https://doi.org/10.1016/j.jbiomech.2025.112843" target="_blank" rel="noopener noreferrer"><img src="/cornell/cartilage-local-shear.jpg" alt="Log-scale plot of shear modulus against depth for human, equine, bovine, and rabbit articular cartilage, with an inset of the first 400 micrometers where the rabbit values overlap the human and bovine surface region." loading="lazy" decoding="async" /></a>
    <div class="paper-card-body">
      <p class="eyebrow">Journal of Biomechanics · 2025</p>
      <h3><a href="https://doi.org/10.1016/j.jbiomech.2025.112843" target="_blank" rel="noopener noreferrer">Local shear properties of rabbit articular cartilage capture surface region mechanics of human, equine, and bovine tissue</a></h3>
      <p>Depth-resolved shear properties of rabbit articular cartilage match the surface and upper-middle zone of human, equine, and bovine tissue. The result is a preclinical model-selection guide: the rabbit is a valid model for surface mechanics and integration studies, the interface where an engineered cartilage repair has to succeed.</p>
      <p class="paper-card-links"><a href="/publications/cartilage-local-shear/">Publication details</a></p>
    </div>
  </article>
</div>

### Imaging and simulation

<div class="video-grid">
  <figure class="research-video">
    <iframe src="https://www.youtube.com/embed/Mmmy3U5GHbI" title="Confocal video of a honeycomb collagen scaffold compressed in its isotropic plane" width="640" height="360" loading="lazy" referrerpolicy="strict-origin-when-cross-origin" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
    <figcaption>Confocal video of a honeycomb collagen scaffold compressed in its isotropic plane. The pore walls buckle as bulk strain rises, the instability behind the plateau in the stress–strain curve. <a href="https://www.youtube.com/watch?v=Mmmy3U5GHbI" target="_blank" rel="noopener noreferrer">YouTube ↗</a></figcaption>
  </figure>
  <figure class="research-video">
    <iframe src="https://www.youtube.com/embed/4Q7CZXjTv2M" title="Sponge scaffold compression with the stress–strain curve synchronized to confocal frames" width="640" height="360" loading="lazy" referrerpolicy="strict-origin-when-cross-origin" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
    <figcaption>Sponge scaffold under compression, with the stress–strain curve synchronized to the confocal frames. The plateau in the bulk response lines up with local collapse of the walls. <a href="https://www.youtube.com/watch?v=4Q7CZXjTv2M" target="_blank" rel="noopener noreferrer">YouTube ↗</a></figcaption>
  </figure>
  <figure class="research-video">
    <iframe src="https://www.youtube.com/embed/UEsVaaHcQGw" title="Finite element simulation of a sponge scaffold under compression on a tetrahedral mesh" width="640" height="360" loading="lazy" referrerpolicy="strict-origin-when-cross-origin" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
    <figcaption>Finite element simulation of a sponge scaffold under compression on a tetrahedral mesh. Where the experiments show collapse, the model can be interrogated for the local stresses that drive it. <a href="https://www.youtube.com/watch?v=UEsVaaHcQGw" target="_blank" rel="noopener noreferrer">YouTube ↗</a></figcaption>
  </figure>
</div>

## Fit and support for disc implants

Biological disc implants replace degenerated tissue with living tissue. Whether they work depends on the mechanics of the disc space they enter and on holding that space while the tissue matures.

<div class="paper-list">
  <article class="paper-card no-figure">
    <div class="paper-card-body">
      <p class="eyebrow">International Journal of Spine Surgery · 2021</p>
      <h3><a href="https://doi.org/10.14444/8052" target="_blank" rel="noopener noreferrer">Pathomechanism and biomechanics of degenerative disc disease: features of healthy and degenerated discs</a></h3>
      <p>A review of the structure and mechanics of healthy and degenerated intervertebral discs, and of how degeneration changes the loads that any replacement must carry.</p>
      <p class="paper-card-links"><a href="/publications/degenerative-disc-biomechanics/">Publication details</a></p>
    </div>
  </article>
  <article class="paper-card">
    <a class="paper-card-figure" href="https://doi.org/10.1002/jsp2.1307" target="_blank" rel="noopener noreferrer"><img src="/cornell/disc-implant-finite-element-modeling.jpg" alt="Six panels comparing an implanted PLA disc cage that failed in vivo with the finite element prediction: the cage in the surgical site, the fractured cage after retrieval, the modeled cage between vertebral endplates, and equivalent-stress maps peaking where the posterior endplate contacts the cage, matching the fracture location." loading="lazy" decoding="async" /></a>
    <div class="paper-card-body">
      <p class="eyebrow">JOR Spine · 2023</p>
      <h3><a href="https://doi.org/10.1002/jsp2.1307" target="_blank" rel="noopener noreferrer">Finite element modeling to predict the influence of anatomic variation and implant placement on performance of biological intervertebral disc implants</a></h3>
      <p>Finite element models of the minipig cervical spine, built from CT, reproduced the in vivo failure of PLA support cages: stress concentrated where bony features of the vertebral endplates pressed on the cage, at the locations that fractured in animals. Shifting the implant and tilting the joint in the model then showed how placement and posture change cage stress and the risk of migration, guidance that applies before an implant is placed.</p>
      <p class="paper-card-links"><a href="/publications/disc-implant-finite-element-modeling/">Publication details</a></p>
    </div>
  </article>
  <article class="paper-card">
    <a class="paper-card-figure" href="https://doi.org/10.1002/jsp2.1363" target="_blank" rel="noopener noreferrer"><img src="/cornell/intervertebral-disc-support.jpg" alt="Two bar charts of terminal disc height index normalized to native disc: flexible FPLA cages match native height while stiff PLA cages fall to discectomy levels, and stably implanted tissue-engineered discs match native height while displaced ones sit between native and discectomy." loading="lazy" decoding="async" /></a>
    <div class="paper-card-body">
      <p class="eyebrow">JOR Spine · 2024</p>
      <h3><a href="https://doi.org/10.1002/jsp2.1363" target="_blank" rel="noopener noreferrer">Flexible support material maintains disc height and supports the formation of hydrated tissue engineered intervertebral discs in vivo</a></h3>
      <p>A flexible, bioresorbable 3D-printed support tolerated nearly twice the deformation of stiff PLA without fracturing, and in the minipig cervical spine it restored native disc height for six weeks while PLA cages fractured within four. Tissue-engineered discs implanted in the flexible cages formed hydrated tissue with about half the T2 signal of native disc. For the cage material and animal model tested here, flexibility rather than stiffness is what kept the space open while tissue formed.</p>
      <p class="paper-card-links"><a href="/publications/intervertebral-disc-support/">Publication details</a></p>
    </div>
  </article>
</div>

<figure class="research-video">
  <iframe src="https://www.youtube.com/embed/ZzFa45o45d0" title="Segmenting cervical spine CT into a 3D model for finite element implant-placement analysis" width="640" height="360" loading="lazy" referrerpolicy="strict-origin-when-cross-origin" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
  <figcaption>Segmenting cervical spine CT into a 3D model. This geometry is the starting point for the finite element implant-placement analysis above. <a href="https://www.youtube.com/watch?v=ZzFa45o45d0" target="_blank" rel="noopener noreferrer">YouTube ↗</a></figcaption>
</figure>

## Manufacturing systems

Reproducible tissue needs reproducible conditioning. The last piece of this work moved mechanical stimulation out of manual handling and into a closed system.

<div class="paper-list">
  <article class="paper-card">
    <a class="paper-card-figure" href="https://patents.google.com/patent/US20240124815A1/en" target="_blank" rel="noopener noreferrer"><img src="/cornell/meniscus-bioreactor.png" alt="Patent drawing of the bioreactor system: a round housing with a lid and an electronics compartment holding the motor, controller, and battery, mounted above the worm-gear bioreactor that holds the graft." loading="lazy" decoding="async" /></a>
    <div class="paper-card-body">
      <p class="eyebrow">Patent application · US 2024/0124815 A1 · 2024</p>
      <h3><a href="https://patents.google.com/patent/US20240124815A1/en" target="_blank" rel="noopener noreferrer">Modular and autonomous bioreactor for tissue-engineered meniscus constructs</a></h3>
      <p>With Charlotte Lee and Lawrence Bonassar. A modular bioreactor with a fixed base, a sliding carriage, and a worm-gear drive stretches a bone–collagen–bone meniscal enthesis graft inside a sealed, battery-powered housing, so mechanical conditioning runs in a standard incubator with no external wires or handling. Stretched constructs elongated and reorganized their collagen fibers relative to unstretched controls, and the microcontroller sets the same stretching schedule for every construct.</p>
      <p class="paper-card-links"><a href="https://patents.google.com/patent/US20240124815A1/en" target="_blank" rel="noopener noreferrer">Read patent ↗</a></p>
    </div>
  </article>
</div>

The logic that runs through this work is the same one that runs through bioprocess development: measure what the cells actually experience, define the controls that keep it within tolerance, and automate the steps that people perform inconsistently. Local strain and composition maps, defined scaffold and support designs, and a sealed bioreactor with a fixed conditioning schedule are that logic applied to engineered tissue. My bioprocess work carries it into cell-culture manufacturing, with physics-based models and scale-down systems in place of the microscope.
