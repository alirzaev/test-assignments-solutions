from rest_framework import serializers


class StatsSerializer(serializers.Serializer):
    date = serializers.DateField()

    views = serializers.IntegerField(default=0, min_value=0)

    clicks = serializers.IntegerField(default=0, min_value=0)

    cost = serializers.DecimalField(default=0.0, decimal_places=2, max_digits=8, min_value=0)


class StatsQueryParamsSerializer(serializers.Serializer):
    from_ = serializers.DateField()

    to = serializers.DateField()

    def get_fields(self):
        fields = super().get_fields()
        from_ = fields.pop('from_')
        fields['from'] = from_

        return fields


class AggregatedStatsSerializer(serializers.Serializer):
    date = serializers.DateField()

    views = serializers.IntegerField(default=0, min_value=0)

    clicks = serializers.IntegerField(default=0, min_value=0)

    cost = serializers.DecimalField(default=0.0, decimal_places=2, max_digits=8, min_value=0)

    cpc = serializers.FloatField()

    cpm = serializers.FloatField()
