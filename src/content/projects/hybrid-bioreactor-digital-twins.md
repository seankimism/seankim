---
title: "Hybrid bioreactor digital twins and scale-down modeling"
description: "Hybrid modeling and AMBR250 scale-down studies supporting bioprocess development, characterization, and optimization."
organization: "Ark Biotech"
period: "2023-2026"
status: "Past work"
tags: ["Mechanistic modeling", "Machine learning", "Cell culture", "Process Development"]
order: 1
---

## The problem

Bioprocess development requires understanding how transport, cell growth, and metabolism interact. Physical experiments are costly and time-consuming, requiring culture media, equipment, and skilled labor. These demands limit how many operating conditions and scales can be explored and can extend development timelines.

Computational models of bioreactors can connect these mechanisms with experimental data to simulate process behavior. By screening operating conditions and testing hypotheses virtually, models can help accelerate development, prioritize the most informative physical experiments, and reduce the resources required to evaluate process decisions.

Other fields already work this way. Roboticists [calibrate a simulator against a physical robot, train controllers in simulation, and validate them on hardware](https://doi.org/10.1109/ICRA55743.2025.11128575), and neuroscientists have [combined a mapped fruit fly connectome with simplified neuron models to predict circuit responses that were later confirmed experimentally](https://www.nature.com/articles/s41586-024-07763-9). Bioprocessing can follow the same cycle, exploring broadly in simulation and then using focused experiments to test and refine the predictions. Small-scale bioreactors close that loop when they reproduce the aspects of large-scale behavior that affect process performance and product quality.

## Hybrid bioreactor digital twin

At [Ark Biotech](https://www.ark-biotech.com/), our team developed a hybrid digital twin of our bioreactors in Python. It combines first-principles models of oxygen transfer, cell growth, and metabolic activity with machine learning fit to experimental data, so the mechanistic models capture the physics and biology we understand and the data-driven components capture the behavior we can measure but not yet derive. I worked on the mechanistic models and on the experiments that calibrated and validated the twin.

The twin ran in closed loop with the bioreactor to control glucose concentration in real time, and it served as the screening tool for the experimental program below: simulations narrowed the parameter space before any physical run and identified which large-scale conditions a scale-down system needed to reproduce.

## Scale-down models and process optimization

Using the twin to choose which conditions to test, I developed AMBR250 and 3 L scale-down models for 15 kL production bioreactors, aligning pCO₂ profiles and critical quality attributes. On that foundation I ran traditional and intensified design-of-experiments studies to identify critical and key process parameters, optimized the process and basal media, and supported scale-up, technology transfer, and process characterization. I also developed the procedures for experimental execution and data collection, and contributed to a root-cause analysis of performance differences across AMBR250, 2 kL, and 15 kL systems.

Together, the media and process optimization raised small-scale titer, and the cross-scale root-cause analysis raised yield in the production bioreactors.
