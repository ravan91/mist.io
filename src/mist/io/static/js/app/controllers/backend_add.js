define('app/controllers/backend_add', [
    'ember'
    ],
    /**
     * Backend add controller
     *
     * @returns Class
     */
    function() {
        return Ember.Object.extend({


            newBackendClear: function() {
                log("new backend clear");
                this.set('newBackendProvider', null);
                this.set('newBackendKey', null);
                this.set('newBackendSecret', null);
            },

            updateNewBackendReady: function() {

                if (this.get('newBackendProvider') &&
                    this.get('newBackendKey') &&
                    this.get('newBackendSecret')) {
                        this.set('newBackendReady', true);
                } else {
                    this.set('newBackendReady', false);
                }
            },

            init: function() {
                this._super();
                this.addObserver('newBackendProvider', this, this.updateNewBackendReady);
                this.addObserver('newBackendKey', this, this.updateNewBackendReady);
                this.addObserver('newBackendSecret', this, this.updateNewBackendReady);
                this.set('newBackendReady', false);
            }
        });
    }
);
