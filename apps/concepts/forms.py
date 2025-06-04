# apps/concepts/forms.py
from django import forms
from .models import Concept

class ConceptForm(forms.ModelForm):
    class Meta:
        model = Concept
        fields = [
            'title',
            'is_public',
        ]
        widgets = {
            'title': forms.TextInput(attrs={
                'class': 'form-control',
                'placeholder': '概念のタイトルを入力してください',
            }),
            'is_public': forms.CheckboxInput(attrs={
                'class': 'form-check-input',
            }),
        }
        labels = {
            'title': '概念タイトル',
            'is_public': '公開設定（他ユーザーに見えるようにする）',
        }
        help_texts = {
            'title': '自分の「概念」を表す名前を入力してください。',
            'is_public': 'チェックを入れると他のユーザーからも見られるようになります。',
        }
