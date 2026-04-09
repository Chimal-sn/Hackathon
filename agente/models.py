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
     # 🔥 AQUÍ VA TU FUNCIÓN
    def calcular_riesgo(self):
        score = 0

        if self.nps < 6:
            score += 50

        if self.num_quejas > 3:
            score += 30

        self.riesgo_score = score

        if score >= 70:
            self.en_riesgo= "alto"
        elif score >= 40:
            self.en_riesgo= "medio"
        else:
            self.en_riesgo= "bajo"

    # 🔥 MUY IMPORTANTE: se ejecuta automáticamente al guardar
    def save(self, *args, **kwargs):
        self.calcular_riesgo()
        super().save(*args, **kwargs)