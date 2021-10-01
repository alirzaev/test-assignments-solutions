from django.db import models


class Stats(models.Model):
    date = models.DateField(unique=True)

    views = models.IntegerField(default=0)

    clicks = models.IntegerField(default=0)

    cost = models.DecimalField(default=0.0, decimal_places=2, max_digits=8)

    def __repr__(self):
        return f"Stats(date='{self.date}', views={self.views}, clicks={self.clicks}, cost={self.cost})"

    def __str__(self):
        return repr(self)
