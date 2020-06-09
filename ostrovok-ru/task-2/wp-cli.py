#!/usr/bin/env python3

import re
from os.path import split

import click
import requests
from bs4 import BeautifulSoup


MONTHS = [
    ('january', 'jan'),
    ('february', 'feb'),
    ('march', 'mar'),
    ('april', 'apr'),
    ('may', 'may'),
    ('june', 'june'),
    ('july', 'july'),
    ('august', 'aug'),
    ('september', 'sep'),
    ('october', 'oct'),
    ('november', 'nov'),
    ('december', 'dec')
]

FILE_BASE_URL = 'http://files.smashingmagazine.com'

PAGE_BASE_URL = 'https://www.smashingmagazine.com'


def create_wallpaper_tag_pred(month, year, resolution, nocal):
    p = re.compile(
        '{base_url}/wallpapers/{month}-{year}/([^/]+)/{cal}/{month}-{year}-([^/])+-{cal}-{res}.(jpg|jpeg|png)'.format(
            base_url=FILE_BASE_URL,
            month=month,
            year=year,
            res=resolution,
            cal='nocal' if nocal else 'cal'
        )
    )

    def wallpaper_tag_pred(tag):
        return tag.name == 'a' and tag.has_attr('href') and re.match(p, tag.attrs['href'])

    return wallpaper_tag_pred


@click.command()
@click.argument('month', type=click.IntRange(1, 12))
@click.argument('year', type=click.IntRange(0))
@click.argument('resolution', type=click.STRING)
@click.option('--nocal', is_flag=True, help='Without calendars')
def cli(month: int, year: int, resolution: str, nocal: bool):
    short_year = year % 100 if int(year) >= 2000 else year
    full_year = str(2000 + year) if year < 2000 else year
    full_month, short_month = MONTHS[month - 1]
    prev_month = '{:02}'.format((12 + month - 2) % 12 + 1)

    html = requests.get(
        '{base_url}/{year}/{prev_month}/desktop-wallpaper-calendars-{month}-{year}/'.format(
            base_url=PAGE_BASE_URL,
            year=full_year,
            prev_month=prev_month,
            month=full_month
        )
    ).content
    soup = BeautifulSoup(html, 'html5lib')
    for tag in soup.find_all(create_wallpaper_tag_pred(short_month, short_year, resolution, nocal)):
        url = tag.attrs['href']
        file_name = split(url)[1]
        with open(file_name, 'wb') as file:
            content = requests.get(url).content
            file.write(content)
            click.echo(file_name)


if __name__ == '__main__':
    cli()
