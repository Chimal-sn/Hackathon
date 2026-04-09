from django.db import models

# Create your models here.
class Cliente(models.Model):
    nombre = models.CharField(max_length=200)
    nps = models.IntegerField()
    num_quejas = models.IntegerField(default=0)
    comentario = models.TextField(blank=True, null=True)
    riesgo_score = models.DecimalField(default=0, max_digits=5, decimal_places=2)
    en_riesgo = models.BooleanField(default=False)
    en_riesgo = models.CharField(max_length=10, default="bajo")
    analisis_ia = models.TextField(blank=True, null=True)
    estrategia_ia = models.TextField(blank=True, null=True)    
     
    def calcular_riesgo(self):
        score = 0

        # 🔴 NPS bajo
        if self.nps < 6:
            score += 50
        elif self.nps < 8:
            score += 20

        # 🔴 muchas quejas
        if self.num_quejas > 5:
            score += 40
        elif self.num_quejas > 2:
            score += 20

        self.riesgo_score = score

        # 🔥 clasificación
        if score >= 70:
            self.en_riesgo = True
        elif score >= 40:
            self.en_riesgo = True
        else:
            self.en_riesgo = False

    # 🔥 MUY IMPORTANTE: se ejecuta automáticamente al guardar
    def save(self, *args, **kwargs):
        self.calcular_riesgo()
        super().save(*args, **kwargs)