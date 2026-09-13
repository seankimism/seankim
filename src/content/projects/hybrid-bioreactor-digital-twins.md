---
title: "Hybrid bioreactor digital twins and scale-down modeling"
description: "Hybrid modeling and AMBR250 scale-down studies supporting bioprocess development, characterization, and optimization."
organization: "Ark Biotech"
period: "2023-2026"
tags: ["Mechanistic modeling", "Machine learning", "Cell culture", "Process Development"]
order: 1
---

## Modeling to guide bioprocess experiments

Bioprocess development requires understanding the interactions among transport, cell growth, and metabolism. Experimental studies require culture media, equipment, skilled labor, and time, which limit the operating conditions and scales that can be evaluated.

Computational bioreactor models combine descriptions of these mechanisms with experimental data to predict process behavior. Screening operating conditions in simulation can help prioritize physical experiments and reduce the time and resources required to evaluate process changes.

This approach has been used in other fields. In robotics, researchers [calibrate a simulator against a physical robot, train controllers in simulation, and validate them on hardware](https://doi.org/10.1109/ICRA55743.2025.11128575). In neuroscience, researchers have [combined a mapped fruit fly connectome with simplified neuron models to predict circuit responses that were later confirmed experimentally](https://www.nature.com/articles/s41586-024-07763-9). Bioprocessing can use a similar sequence of simulation, targeted experiments, and model refinement. Small-scale bioreactors support this process when they reproduce the large-scale conditions that influence process performance and product quality.

## Hybrid bioreactor digital twin

At [Ark Biotech](https://www.ark-biotech.com/), our team developed a hybrid digital twin of our bioreactors in Python. The twin combines first-principles models of oxygen transfer, cell growth, and metabolic activity with machine learning fitted to experimental data. The mechanistic components describe known physical and biological processes, while the data-driven components represent measured behavior that is not yet described mechanistically. I contributed to the mechanistic models and the experiments used to calibrate and validate the twin.

The twin was used to screen conditions for the experimental program described below. Simulations narrowed the parameter space before experimental runs and identified the large-scale conditions that a scale-down system needed to reproduce.

## Scale-down models and process optimization

Using the twin to select experimental conditions, I developed AMBR250 and 3 L scale-down models of production-scale bioreactors. These models aligned pCO₂ profiles and critical quality attributes across scales. I then conducted traditional and intensified design-of-experiments studies to identify critical and key process parameters, optimized process conditions and basal media, and supported scale-up, technology transfer, and process characterization. I also developed procedures for experimental execution and data collection and contributed to a root-cause analysis of performance differences between scale-down and production systems.

Media and process optimization increased small-scale titer. Separately, the root-cause analysis of differences across scales contributed to increased yield in production bioreactors.
