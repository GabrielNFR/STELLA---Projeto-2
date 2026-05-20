from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('tratamento', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='EventoAgenda',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('titulo', models.CharField(max_length=120)),
                ('tipo', models.CharField(choices=[('consulta', 'Consulta'), ('exame', 'Exame')], max_length=20)),
                ('data', models.DateField()),
                ('horario', models.TimeField()),
                ('local', models.CharField(blank=True, max_length=120)),
                ('observacoes', models.TextField(blank=True)),
                ('criado_em', models.DateTimeField(auto_now_add=True)),
                ('atualizado_em', models.DateTimeField(auto_now=True)),
            ],
            options={
                'ordering': ['data', 'horario', 'titulo'],
            },
        ),
    ]
