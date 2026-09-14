---
title: "Mechanics-informed tissue engineering"
description: "Investigating how scaffold mechanics, cell behavior, and bioreactor design influence the manufacture of engineered tissues."
organization: "Cornell University"
publishedDate: "2026-09-09"
period: "2019–2023"
tags: ["Biomechanics", "Biofabrication", "Finite element analysis", "Bioreactor design"]
order: 3
---

<p class="project-lede">My doctoral research in <a href="https://bonassar.research.engineering.cornell.edu/">Lawrence Bonassar's lab</a> at Cornell combined experimental mechanics, finite element modeling, implant design, and automated bioreactor development. The studies below include work from my dissertation and related collaborations.</p>

## Mechanical design of engineered tissues

Engineered tissues experience mechanical loading during manufacture, maturation, and implantation. However, bulk mechanical measurements do not resolve the local deformation that cells experience within these constructs, and the relationship between global loading and the local mechanical environment in engineered tissues remains poorly understood. Understanding this relationship is critical for designing constructs that survive loading and for manufacturing them reproducibly. As such, my doctoral research investigated the relationship among scaffold architecture, local composition, and the micromechanical environment in porous collagen scaffolds for cartilage and in biological intervertebral disc implants. More specifically, I (i) mapped local instabilities and cell death in collagen scaffolds under compression, (ii) developed finite element models and a bioabsorbable support for tissue-engineered disc implants, and (iii) contributed to an automated, closed bioreactor for mechanical conditioning of meniscus grafts.

Notably, manufacturers currently assess engineered cartilage by destructive mechanical testing of sampled constructs from each batch. The local failure modes and compositional thresholds identified in these studies suggest local instabilities and local composition as potential quality parameters that could be monitored non-destructively.

<p class="dissertation-note">Dissertation: <em>Mechanically Informed Design Controls for Tissue Engineered Cartilage Biofabrication: Importance of Micro Failure, Architecture, and Composition</em>, Cornell University, 2023.</p>

<div class="arc-list">
  <div class="arc-row"><span class="arc-number">01</span><div><h3>Local mechanics and cell viability</h3><p>Buckling, densification, and local compositional thresholds dictate where strain concentrates within engineered cartilage. Such local instabilities, rather than bulk strain, are the primary mechanical driver of chondrocyte death.</p></div></div>
  <div class="arc-row"><span class="arc-number">02</span><div><h3>Implant placement and mechanical support</h3><p>Anatomic variation and implant placement set the loads on biological disc implants. A flexible bioabsorbable support maintains disc height while the implanted tissue matures.</p></div></div>
  <div class="arc-row"><span class="arc-number">03</span><div><h3>Manufacturing reproducibility</h3><p>Cell source accounts for much of the variation among constructs, while local composition provides a potential parameter for non-destructive quality control. A closed, automated bioreactor standardizes mechanical conditioning during tissue manufacture.</p></div></div>
</div>

## Local mechanics and cell fate

I utilized fast confocal microscopy combined with digital image correlation to map local strain in scaffolds and tissues during loading. Such measurements connected scaffold architecture and tissue composition to the micromechanical environment at the cellular scale, from empty scaffolds to living tissue.

<div class="paper-list">
  <article class="paper-card">
    <a class="paper-card-figure" href="https://doi.org/10.1007/s11340-022-00853-7" target="_blank" rel="noopener noreferrer"><img src="/cornell/collagen-scaffold-buckling.png" alt="Compressive stress–strain curve of a honeycomb collagen scaffold with confocal images at four points along it: undeformed columnar pores, first buckling at the end of the linear region, local collapse bands forming, and a global collapse band with densification." loading="lazy" decoding="async" /></a>
    <div class="paper-card-body">
      <p class="eyebrow">Experimental Mechanics · 2022</p>
      <h3><a href="https://doi.org/10.1007/s11340-022-00853-7" target="_blank" rel="noopener noreferrer">The role of buckling instabilities in the global and local mechanical response in porous collagen scaffolds</a></h3>
      <p>We performed multi-scale mechanical analysis on honeycomb and sponge collagen scaffolds using confined compression and confocal strain mapping. The global response of both architectures followed the pattern characteristic of cellular solids, with linear, plateau, and densification regions, and the plateau corresponded to local instabilities such as snap-through buckling. Interestingly, the two architectures were nearly indistinguishable in bulk but distinct at the local scale: honeycomb scaffolds experienced a unimodal strain distribution throughout their depth, whereas sponge scaffolds collapsed at the boundaries, which makes local strain mapping critical for designing porous scaffold architectures.</p>
      <p class="paper-card-links"><a href="/publications/collagen-scaffold-buckling/">Publication details</a></p>
    </div>
  </article>
  <article class="paper-card">
    <a class="paper-card-figure" href="https://doi.org/10.1101/2024.06.18.599620" target="_blank" rel="noopener noreferrer"><img src="/cornell/collagen-scaffold-auxetic-behavior.jpg" alt="Micro-CT reconstructions of a honeycomb collagen scaffold at six compressive strains from 0 to 40 percent, with mid-height and transverse cross-sections showing the outline contracting inward as walls buckle, and two highlighted cells that fold progressively." loading="lazy" decoding="async" /></a>
    <div class="paper-card-body">
      <p class="eyebrow">bioRxiv preprint · 2024</p>
      <h3><a href="https://doi.org/10.1101/2024.06.18.599620" target="_blank" rel="noopener noreferrer">3D in-situ characterization reveals the instability-induced auxetic behavior of collagen scaffolds for tissue engineering</a></h3>
      <p>In-situ micro-CT during compression revealed that the same strut instabilities produce auxetic behavior: the scaffolds contracted laterally as they were compressed. This response was concentrated near the construct boundaries, where an implant must integrate with native cartilage. Such lateral contraction may open gaps at the interface and compromise integration.</p>
      <p class="paper-card-links"><a href="/publications/collagen-scaffold-auxetic-behavior/">Publication details</a></p>
    </div>
  </article>
  <article class="paper-card">
    <a class="paper-card-figure" href="https://doi.org/10.1016/j.jbiomech.2023.111591" target="_blank" rel="noopener noreferrer"><img src="/cornell/chondrocyte-viability-scaffold-instabilities.jpg" alt="Two rows of confocal images for the isotropic and orthotropic planes of a cell-seeded collagen scaffold at 30 percent bulk strain: the deformed scaffold with buckled walls, the local axial strain map, and the live/dead image showing dead cells where deformation was highest." loading="lazy" decoding="async" /></a>
    <div class="paper-card-body">
      <p class="eyebrow">Journal of Biomechanics · 2023</p>
      <h3><a href="https://doi.org/10.1016/j.jbiomech.2023.111591" target="_blank" rel="noopener noreferrer">Instabilities induced by mechanical loading determine the viability of chondrocytes grown on porous scaffolds</a></h3>
      <p>We utilized fast confocal microscopy combined with strain mapping to analyze architecture-dependent instabilities and subsequent chondrocyte death in honeycomb and sponge scaffolds under compression. Both scaffolds exhibited elastic, buckled, and densified deformation modes. Cell death was minimal in elastic regions and trended upward in buckled regions. More interestingly, cell death increased significantly in densified regions, and scaffold orientation was far more important than scaffold architecture for chondrocyte viability. These results suggest that aligning the scaffold with the direction of in vivo load might be crucial for preventing cell death after implantation.</p>
      <p class="paper-card-links"><a href="/publications/chondrocyte-viability-scaffold-instabilities/">Publication details</a></p>
    </div>
  </article>
  <article class="paper-card">
    <a class="paper-card-figure" href="https://doi.org/10.1007/978-3-031-25588-5_2" target="_blank" rel="noopener noreferrer"><img src="/cornell/physical-stimuli-chondrocyte-behavior.jpg" alt="Schematic of microscale cartilage mechanobiology: a loading stage on a microscope objective, a confocal image of stained chondrocytes, strain-norm and shear-strain maps of the tissue, and a plot relating microscale physical stimuli to chondrocyte response." loading="lazy" decoding="async" /></a>
    <div class="paper-card-body">
      <p class="eyebrow">Book chapter · Electromechanobiology of Cartilage and Osteoarthritis · 2023</p>
      <h3><a href="https://doi.org/10.1007/978-3-031-25588-5_2" target="_blank" rel="noopener noreferrer">Understanding the influence of local physical stimuli on chondrocyte behavior</a></h3>
      <p>In this chapter, we reviewed five decades of research on chondrocyte mechanobiology, from bulk biosynthesis assays to real-time confocal imaging of individual cells. More specifically, we examined how static, dynamic, and injurious loading generate the local physical stimuli that chondrocytes experience, including matrix deformation, interstitial fluid flow, hydrostatic pressure, and physicochemical changes.</p>
      <p class="paper-card-links"><a href="/publications/physical-stimuli-chondrocyte-behavior/">Publication details</a></p>
    </div>
  </article>
  <article class="paper-card">
    <a class="paper-card-figure" href="https://doi.org/10.1016/j.actbio.2021.07.003" target="_blank" rel="noopener noreferrer"><img src="/cornell/cartilage-manufacturing-reproducibility.png" alt="Histograms and per-source box plots of aggregate modulus and hydraulic permeability for human tissue-engineered cartilage from seven chondrocyte sources labeled A to G, with aggregate modulus spanning roughly 10 to 1000 kilopascals between sources." loading="lazy" decoding="async" /></a>
    <div class="paper-card-body">
      <p class="eyebrow">Acta Biomaterialia · 2021</p>
      <h3><a href="https://doi.org/10.1016/j.actbio.2021.07.003" target="_blank" rel="noopener noreferrer">The influence of chondrocyte source on the manufacturing reproducibility of human tissue engineered cartilage</a></h3>
      <p>This study tested more than 200 human tissue-engineered cartilage constructs from seven chondrocyte sources in compression, friction, and shear. Compressive properties varied by orders of magnitude among cell sources and friction varied fivefold, while shear modulus did not change. In addition, depth-dependent strain fields varied with cell source. These results highlight compressive properties and local mechanics as the relevant measures of manufacturing reproducibility.</p>
      <p class="paper-card-links"><a href="/publications/cartilage-manufacturing-reproducibility/">Publication details</a></p>
    </div>
  </article>
  <article class="paper-card">
    <a class="paper-card-figure" href="https://doi.org/10.1016/j.jbiomech.2023.111882" target="_blank" rel="noopener noreferrer"><img src="/cornell/osteochondral-strain-concentrations.png" alt="Six panels plotting local compressive strain, shear strain, and strain norm of engineered cartilage spheroids against local aggrecan and collagen concentration, with sigmoidal fits showing sharp compositional thresholds for static and perfusion-cultured constructs." loading="lazy" decoding="async" /></a>
    <div class="paper-card-body">
      <p class="eyebrow">Journal of Biomechanics · 2024</p>
      <h3><a href="https://doi.org/10.1016/j.jbiomech.2023.111882" target="_blank" rel="noopener noreferrer">Microscale strain concentrations in tissue-engineered osteochondral implants are dictated by local compositional thresholds and architecture</a></h3>
      <p>We investigated osteochondral implants manufactured by fusing condensed mesenchymal cell bodies onto trabecular bone, combining confocal strain mapping with Fourier transform infrared spectroscopy to register local strain against local composition. Under compression, strain concentrated at poorly integrated spheroid boundaries, where aggrecan concentration was low and collagen concentration was high. Remarkably, we identified a strong threshold relationship between the two: below a distinct aggrecan concentration, the constructs experienced a greater than threefold increase in compressive strain. This study suggests that local composition is the primary driver of the micromechanical environment and a potential quality control parameter for tissue manufacturing.</p>
      <p class="paper-card-links"><a href="/publications/osteochondral-strain-concentrations/">Publication details</a></p>
    </div>
  </article>
  <article class="paper-card">
    <a class="paper-card-figure" href="https://doi.org/10.1016/j.jbiomech.2025.112843" target="_blank" rel="noopener noreferrer"><img src="/cornell/cartilage-local-shear.jpg" alt="Log-scale plot of shear modulus against depth for human, equine, bovine, and rabbit articular cartilage, with an inset of the first 400 micrometers where the rabbit values overlap the human and bovine surface region." loading="lazy" decoding="async" /></a>
    <div class="paper-card-body">
      <p class="eyebrow">Journal of Biomechanics · 2025</p>
      <h3><a href="https://doi.org/10.1016/j.jbiomech.2025.112843" target="_blank" rel="noopener noreferrer">Local shear properties of rabbit articular cartilage capture surface region mechanics of human, equine, and bovine tissue</a></h3>
      <p>Depth-resolved shear measurements showed that rabbit articular cartilage recapitulates the shear properties of the surface and upper-middle zones of human, equine, and bovine tissue. As such, the rabbit is a suitable preclinical model for surface mechanics and integration studies, where an engineered cartilage repair must succeed.</p>
      <p class="paper-card-links"><a href="/publications/cartilage-local-shear/">Publication details</a></p>
    </div>
  </article>
</div>

### Imaging and simulation

<div class="video-grid">
  <figure class="research-video">
    <iframe src="https://www.youtube.com/embed/Mmmy3U5GHbI" title="Confocal video of a honeycomb collagen scaffold compressed in its isotropic plane" width="640" height="360" loading="lazy" referrerpolicy="strict-origin-when-cross-origin" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
    <figcaption>Confocal video of a honeycomb collagen scaffold compressed in its isotropic plane. Pore-wall buckling develops with increasing bulk strain and contributes to the plateau in the stress–strain curve. <a href="https://www.youtube.com/watch?v=Mmmy3U5GHbI" target="_blank" rel="noopener noreferrer">YouTube ↗</a></figcaption>
  </figure>
  <figure class="research-video">
    <iframe src="https://www.youtube.com/embed/4Q7CZXjTv2M" title="Sponge scaffold compression with the stress–strain curve synchronized to confocal frames" width="640" height="360" loading="lazy" referrerpolicy="strict-origin-when-cross-origin" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
    <figcaption>Sponge scaffold under compression, with the stress–strain curve synchronized to the confocal frames. The plateau in the bulk response corresponds to local collapse of the scaffold walls. <a href="https://www.youtube.com/watch?v=4Q7CZXjTv2M" target="_blank" rel="noopener noreferrer">YouTube ↗</a></figcaption>
  </figure>
  <figure class="research-video">
    <iframe src="https://www.youtube.com/embed/UEsVaaHcQGw" title="Finite element simulation of a sponge scaffold under compression on a tetrahedral mesh" width="640" height="360" loading="lazy" referrerpolicy="strict-origin-when-cross-origin" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
    <figcaption>Finite element simulation of a sponge scaffold under compression on a tetrahedral mesh. The model allows local stresses to be examined in regions where collapse was observed experimentally. <a href="https://www.youtube.com/watch?v=UEsVaaHcQGw" target="_blank" rel="noopener noreferrer">YouTube ↗</a></figcaption>
  </figure>
</div>

## Fit and support for disc implants

Biological disc implants replace degenerated tissue with living tissue. However, their in vivo performance depends on the mechanical environment of the disc space, and maintaining that space while the implanted tissue matures remains a major hurdle.

<div class="paper-list">
  <article class="paper-card no-figure">
    <div class="paper-card-body">
      <p class="eyebrow">International Journal of Spine Surgery · 2021</p>
      <h3><a href="https://doi.org/10.14444/8052" target="_blank" rel="noopener noreferrer">Pathomechanism and biomechanics of degenerative disc disease: features of healthy and degenerated discs</a></h3>
      <p>This review examines the structure and mechanics of healthy and degenerated intervertebral discs. In particular, it describes how degeneration alters the loading conditions that any disc replacement must accommodate.</p>
      <p class="paper-card-links"><a href="/publications/degenerative-disc-biomechanics/">Publication details</a></p>
    </div>
  </article>
  <article class="paper-card">
    <a class="paper-card-figure" href="https://doi.org/10.1002/jsp2.1307" target="_blank" rel="noopener noreferrer"><img src="/cornell/disc-implant-finite-element-modeling.jpg" alt="Six panels comparing an implanted PLA disc cage that failed in vivo with the finite element prediction: the cage in the surgical site, the fractured cage after retrieval, the modeled cage between vertebral endplates, and equivalent-stress maps peaking where the posterior endplate contacts the cage, matching the fracture location." loading="lazy" decoding="async" /></a>
    <div class="paper-card-body">
      <p class="eyebrow">JOR Spine · 2023</p>
      <h3><a href="https://doi.org/10.1002/jsp2.1307" target="_blank" rel="noopener noreferrer">Finite element modeling to predict the influence of anatomic variation and implant placement on performance of biological intervertebral disc implants</a></h3>
      <p>We developed CT-based finite element models of the minipig cervical spine to understand the in vivo failure of PLA support cages. Stress concentrated where bony features of the vertebral endplates contacted the cage, which corresponded to the fracture locations observed in animals. Furthermore, simulating implant displacement and joint tilt showed how placement and posture change cage stress and migration risk, providing guidance for implant placement prior to surgery.</p>
      <p class="paper-card-links"><a href="/publications/disc-implant-finite-element-modeling/">Publication details</a></p>
    </div>
  </article>
  <article class="paper-card">
    <a class="paper-card-figure" href="https://doi.org/10.1002/jsp2.1363" target="_blank" rel="noopener noreferrer"><img src="/cornell/intervertebral-disc-support.jpg" alt="Two bar charts of terminal disc height index normalized to native disc: flexible FPLA cages match native height while stiff PLA cages fall to discectomy levels, and stably implanted tissue-engineered discs match native height while displaced ones sit between native and discectomy." loading="lazy" decoding="async" /></a>
    <div class="paper-card-body">
      <p class="eyebrow">JOR Spine · 2024</p>
      <h3><a href="https://doi.org/10.1002/jsp2.1363" target="_blank" rel="noopener noreferrer">Flexible support material maintains disc height and supports the formation of hydrated tissue engineered intervertebral discs in vivo</a></h3>
      <p>We designed a flexible, bioresorbable 3D-printed support that tolerated nearly twice the deformation of stiff PLA without fracture. In the minipig cervical spine, the flexible support restored native disc height for six weeks, whereas PLA cages fractured within four weeks. In addition, tissue-engineered discs implanted in flexible cages formed hydrated tissue with approximately half the T2 signal of native disc. These results indicate that support flexibility, rather than stiffness, is what maintains the disc space during tissue formation.</p>
      <p class="paper-card-links"><a href="/publications/intervertebral-disc-support/">Publication details</a></p>
    </div>
  </article>
</div>

<figure class="research-video">
  <iframe src="https://www.youtube.com/embed/ZzFa45o45d0" title="Segmenting cervical spine CT into a 3D model for finite element implant-placement analysis" width="640" height="360" loading="lazy" referrerpolicy="strict-origin-when-cross-origin" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
  <figcaption>Segmentation of cervical spine CT images to generate a 3D model. CT segmentation provides the geometry for finite element analysis of implant placement. <a href="https://www.youtube.com/watch?v=ZzFa45o45d0" target="_blank" rel="noopener noreferrer">YouTube ↗</a></figcaption>
</figure>

## Manufacturing systems

Reproducible tissue manufacture requires consistent mechanical conditioning, yet manual handling introduces variability between constructs. This work automated mechanical stimulation within a closed bioreactor system.

<div class="paper-list">
  <article class="paper-card">
    <a class="paper-card-figure" href="https://patents.google.com/patent/US20240124815A1/en" target="_blank" rel="noopener noreferrer"><img src="/cornell/meniscus-bioreactor.png" alt="Patent drawing of the bioreactor system: a round housing with a lid and an electronics compartment holding the motor, controller, and battery, mounted above the worm-gear bioreactor that holds the graft." loading="lazy" decoding="async" /></a>
    <div class="paper-card-body">
      <p class="eyebrow">Patent application · US 2024/0124815 A1 · 2024</p>
      <h3><a href="https://patents.google.com/patent/US20240124815A1/en" target="_blank" rel="noopener noreferrer">Modular and autonomous bioreactor for tissue-engineered meniscus constructs</a></h3>
      <p>With Charlotte Lee and Lawrence Bonassar, I developed a modular bioreactor for mechanical conditioning of bone–collagen–bone meniscal enthesis grafts. A fixed base, sliding carriage, and worm-gear drive apply stretching within a sealed, battery-powered housing, so the system operates in a standard incubator without external wiring or manual handling. A microcontroller applies the same stretching schedule to every construct. Stretched constructs elongated and exhibited collagen fiber reorganization compared to unstretched controls.</p>
      <p class="paper-card-links"><a href="https://patents.google.com/patent/US20240124815A1/en" target="_blank" rel="noopener noreferrer">Read patent ↗</a></p>
    </div>
  </article>
</div>

Collectively, these studies show that the micromechanical environment, rather than bulk mechanics, dictates cell viability and construct performance, and that local strain and composition are measurable parameters for controlling it. Overall, mechanically informed design controls, from scaffold architecture to implant support to automated conditioning, are crucial for manufacturing engineered tissues reproducibly. My bioprocess work applies the same approach to cell-culture manufacturing through physics-based models and scale-down systems.
