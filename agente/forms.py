from django import forms
from .models import Cliente

class ClienteForm(forms.ModelForm):
    class Meta:
        model = Cliente
        # Aquí defines exactamente cuáles campos quieres que aparezcan en tu formulario
        fields = ['nombre', 'nps', 'num_quejas']
