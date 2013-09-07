"""Routes and wsgi app creation"""
import yaml
import logging

import requests

from pyramid.config import Configurator

from mist.io.resources import Root
from mist.io import helpers
from mist.io.shell import ShellMiddleware

log = logging.getLogger('mist.io')


def main(global_config, **settings):
    """This function returns a Pyramid WSGI application."""
    if not settings.keys():
        settings = global_config

    # Import settings using sensible defaults where applicable
    helpers.load_settings(settings)

    # try to authenticate with mist.io service if email & password are available
    if settings.get('email') and settings.get('password'):
        payload = {'email': settings.get('email'),
                   'password': settings.get('password')}
        ret = requests.post(settings['core_uri'] + '/auth', params=payload, verify=False)
        if ret.status_code == 200:
            settings['auth'] = 1
        else:
            settings['auth'] = 0

    config = Configurator(root_factory=Root, settings=settings)

    config.add_static_view('resources', 'mist.io:static')

    config.add_route('home', '/')
    config.add_route('backends', '/backends')
    config.add_route('backend_action', '/backends/{backend}')

    config.add_route('machines', '/backends/{backend}/machines')
    config.add_route('machine', '/backends/{backend}/machines/{machine}')
    config.add_route('machine_metadata',
                     '/backends/{backend}/machines/{machine}/metadata')
    config.add_route('probe',
                     '/backends/{backend}/machines/{machine}/probe')
    config.add_route('shell',
                     '/backends/{backend}/machines/{machine}/shell')

    config.add_route('monitoring', '/monitoring')
    config.add_route('update_monitoring',
                     '/backends/{backend}/machines/{machine}/monitoring')

    config.add_route('images', '/backends/{backend}/images')
    config.add_route('image', '/backends/{backend}/images/{image}')
    config.add_route('sizes', '/backends/{backend}/sizes')
    config.add_route('locations', '/backends/{backend}/locations')

    config.add_route('keys', '/keys')
    config.add_route('key', '/keys/{key}')

    config.add_route('rules', '/rules')
    config.add_route('rule', '/rules/{rule}')

    config.scan()

    app = config.make_wsgi_app()
    app = ShellMiddleware(app)

    return app
