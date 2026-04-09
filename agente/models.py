from django.db import models

# Create your models here.
class Cliente(models.Model):
    nombre = models.CharField(max_length=200)
    nps = models.IntegerField()
    num_quejas = models.IntegerField(default=0)
    comentario = models.TextField(blank=True, null=True)
    riesgo_score = models.DecimalField(default=0, max_digits=5, decimal_places=2)
    en_riesgo = models.BooleanField(default=False)
    analisis_ia = models.TextField(blank=True, null=True)
    estrategia_ia = models.TextField(blank=True, null=True)    
    
    
    