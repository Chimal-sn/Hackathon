from django.db import models

class Cliente(models.Model):
    nombre = models.CharField(max_length=200)
    nps = models.IntegerField()
    num_quejas = models.IntegerField(default=0)
    comentario = models.TextField()
    riesgo_score = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    en_riesgo = models.BooleanField(default=False)
    analisis_ia = models.TextField(blank=True, null=True)
    estrategia_ia = models.TextField(blank=True, null=True)

    def calcular_riesgo(self):
        score = 0

        if self.nps < 6:
            score += 50

        if self.num_quejas > 3:
            score += 30

        self.riesgo_score = score
        self.en_riesgo = score >= 50

    def generar_analisis(self):
        from openai import OpenAI
        client = OpenAI(api_key="AIzaSyBNamAAEEQ6yLin34EazcFtqRHKUmFhAYY")

        prompt = f"""
        Cliente: {self.nombre}
        NPS: {self.nps}
        Quejas: {self.num_quejas}
        Comentario: {self.comentario}

        Analiza el riesgo y da una estrategia.
        """

        response = client.chat.completions.create(
            model="gpt-4.1-mini",
            messages=[{"role": "user", "content": prompt}]
        )

        texto = response.choices[0].message.content
        self.analisis_ia = texto
        self.estrategia_ia = texto

    def save(self, *args, **kwargs):
        self.calcular_riesgo()
        self.generar_analisis()
        super().save(*args, **kwargs)