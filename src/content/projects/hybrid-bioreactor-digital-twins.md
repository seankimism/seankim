---
title: "Hybrid bioreactor digital twins and scale-down modeling"
description: "Hybrid modeling and AMBR250 scale-down studies supporting bioprocess development, characterization, and optimization."
organization: "Ark Biotech"
period: "2023-2026"
tags: ["Mechanistic modeling", "Machine learning", "Cell culture", "Process Development"]
order: 1
---

## Modeling to guide bioprocess experiments

Bioprocess development requires understanding the interactions among transport, cell growth, and metabolism. However, experimental studies require culture media, equipment, skilled labor, and time, which limit the operating conditions and scales that can be evaluated.

Computational bioreactor models combine descriptions of these mechanisms with experimental data to predict process behavior. Screening operating conditions in simulation therefore helps prioritize the most informative physical experiments and reduces the time and resources required to evaluate process changes.

Such an approach is well established in other fields. In robotics, researchers [calibrate a simulator against a physical robot, train controllers in simulation, and validate them on hardware](https://doi.org/10.1109/ICRA55743.2025.11128575). In neuroscience, researchers have [combined a mapped fruit fly connectome with simplified neuron models to predict circuit responses that were later confirmed experimentally](https://www.nature.com/articles/s41586-024-07763-9). Bioprocessing can follow the same sequence of simulation, targeted experiments, and model refinement. Notably, small-scale bioreactors close this loop only when they recapture the large-scale conditions that influence process performance and product quality.

## Hybrid bioreactor digital twin

At [Ark Biotech](https://www.ark-biotech.com/), our team developed a hybrid digital twin of our bioreactors in Python. The twin combines first-principles models of oxygen transfer, cell growth, and metabolic activity with machine learning fitted to experimental data. More specifically, the mechanistic components describe the physical and biological processes that we understand, while the data-driven components capture the behavior that we can measure but cannot yet derive. I built the mechanistic models of oxygen transfer, cell growth, and metabolism and ran the experiments that calibrated and validated the twin.

We utilized the twin to screen conditions for the experimental program described below. Simulations narrowed the parameter space before any physical run and identified the large-scale conditions that a scale-down system needed to reproduce.

## Scale-down models and process optimization

Using the twin to select experimental conditions, I developed AMBR250 and 3 L scale-down models of production-scale bioreactors that aligned pCO₂ profiles and critical quality attributes across scales. On this basis, I (i) conducted traditional and intensified design-of-experiments studies to identify critical and key process parameters, (ii) optimized process conditions and basal media, and (iii) supported scale-up, technology transfer, and process characterization. In addition, I developed procedures for experimental execution and data collection and contributed to a root-cause analysis of performance differences between scale-down and production systems.

Notably, media and process optimization increased small-scale titer, and the root-cause analysis across scales contributed to increased yield in production bioreactors. Overall, this work suggests that combining a calibrated digital twin with representative scale-down models is crucial for prioritizing experiments and transferring processes across scales.
