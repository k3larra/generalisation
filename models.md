## Class probabilities reported on ImangeNet-1K for the models used in the study.
acc@1 indicates the probability the true label is predicted with highest probability, acc@5 that the true label is among the top 5. For this study we use weights that gives the best outcome. The test set used is not identical in relation to the class probabilities, instead it depends on the test-set used the year the models competed in the ILSVRC challenge [more info](https://www.image-net.org/challenges/LSVRC/). The classes in ImageNet-1K for this challenge, using single crops, are the same over the years. We use the same image transformation for all models in this study [here](https:). Information collected from  [PyTorch information](https://pytorch.org/vision/stable/models.html) page for pretrained models. These pretrained models are are used throughout this study.

| Model           | Weights      | acc@1     | acc@5     | Params |
|-----------------|--------------|--------|--------|--------|
|ResNet50         |IMAGENET1K_V1 | 76.1   | 92.9   | 25.6M  |
|ResNet50         |IMAGENET1K_V2 | 80.9   | 95.4   | 25.6M  |
|ResNet101        |IMAGENET1K_V2 | 81.9   | 95.8   | 25.6M  |
|ResNet152        |IMAGENET1K_V2 | 82.3   | 94.0   | 60.2M  |
|GoogLeNet        |IMAGENET1K_V1 | 70.0   | 90.0   | 6.6M   |
|Inception_V3     |IMAGENET1K_V1 | 77.3   | 93.4   | 27.2M  |
|Efficientnet_V2_s|IMAGENET1K_V1 | 84.2   | 96.9   | 21.5M  |
|RegNet_Y_8GF     |IMAGENET1K_V2 | 82.2   | 95.0   | 39.4M  |
|Swin_T_Weights   |IMAGENET1K_V1 | 81.4   | 95.8   | 28.3M  |
|ConvNeXt_Tiny    |IMAGENET1K_V1 | 79.9   | 94.5   | 28.6M  |
|                 |              |avg 80.0|avg 94.6|        |
