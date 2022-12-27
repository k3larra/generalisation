# Deep Learning, generalisation and concepts
Website accompanying the paper with the above title. his site adds code and additional material for reproducibility.

**Abstract** *Central to deep learning is an ability to generalise within a target domain akin to human beliefs within the same domain. A label inferred by the neural network then maps to a human mental representation of a, to the label, corresponding concept. If an explanation concerning why a specific decision is promoted it is important that we move from average case performance metrics towards interpretable explanations that builds on human understandable concepts connected to the promoted label. In this work we use Explainable Artificial Intelligence (XAI) methods to investigate if internal knowledge representations in a trained neural networks are aligned and generalise in correspondence to human mental representations. Our findings indicate an, in neural networks, epistemic misalignment between machine and human knowledge representations. Consequently, if the goal is classifications explainable for end users we can question the usefulness of neural networks trained without considering concept alignment.*

## Code used
[training notebook](shapes_train.ipynb)

[evaluation notebook](shapes_XAI_evaluate.ipynb)

Studies:
[trained models](https://k3larra.github.io/generalisation/models01.html)

<!--
prediction code used in study 1 and 2
```python
#Loading pretrained resnet50 model with V1 weights
torch.hub._validate_not_a_forked_repo=lambda a,b,c: True #Skum grej från https://github.com/pytorch/pytorch/
model = torch.hub.load('pytorch/vision:v0.10.0', 'resnet50', pretrained=True)
```

 Click the images for to get the ML-model comparisons.

[![](testset/thumbnails/0.jpg)](https://k3larra.github.io/ood/sorrel_version01.html?study_nbr=0)
[![](testset/thumbnails/1.jpg)](https://k3larra.github.io/ood/sorrel_version01.html?study_nbr=1)
[![](testset/thumbnails/2.jpg)](https://k3larra.github.io/ood/sorrel_version01.html?study_nbr=2)
[![](testset/thumbnails/3.jpg)](https://k3larra.github.io/ood/sorrel_version01.html?study_nbr=3)
[![](testset/thumbnails/4.jpg)](https://k3larra.github.io/ood/sorrel_version01.html?study_nbr=4)
[![](testset/thumbnails/5.jpg)](https://k3larra.github.io/ood/sorrel_version01.html?study_nbr=5)


[Information on pretrained models used in Study 3](https://github.com/k3larra/ood/blob/main/models.md)
[Link to code for study 3] -->


[Information on pretrained models used in Study 3](https://github.com/k3larra/ood/blob/main/models.md)
