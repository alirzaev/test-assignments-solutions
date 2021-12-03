from django.db import models


class Ad(models.Model):
    title = models.CharField(max_length=200)

    description = models.CharField(max_length=1000)

    price = models.DecimalField(max_digits=10, decimal_places=2)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self) -> str:
        return f"Ad(title='{self.title}')"


class Photo(models.Model):
    url = models.URLField()

    ad = models.ForeignKey(Ad, on_delete=models.CASCADE, related_name='photos')

    def __str__(self) -> str:
        return f"Photo(url='{self.url}', ad_id={self.ad.id})"
