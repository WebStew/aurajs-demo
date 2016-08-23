define(function() {

    return function( application ) {

            // Variable to hold the current state of the view
        var state,

            // Cached pointers to the application core and sandbox
            core = application.core,
            sandbox = application.sandbox,

            // The media query string we will check against
            query = 'screen and (min-width:{{min-break-point}}px) and (max-width:{{max-break-point}}px)',

            // The different screen sizes our application changes at
            states = {
                xxs: {
                    min: 0,
                    max: 459,
                    size: 'xxs'
                },
                xs: {
                    min: 460,
                    max: 747,
                    size: 'xs'
                },
                s: {
                    min: 748,
                    max: 1003,
                    size: 's'
                },
                m: {
                    min: 1004,
                    max: 1119,
                    size: 'm'
                },
                l: {
                    min: 1120,
                    max: 1379,
                    size: 'l'
                },
                xl: {
                    min: 1380,
                    max: 1579,
                    size: 'xl'
                },
                xxl: {
                    min: 1580,
                    max: 2500,
                    size: 'xxl'
                }
            },

            // Getters
            get = {
                state: function() {
                    return state;
                },
            },

            // Setters
            set = {

                // Sets exposed Enquire methods onto the application
                enquire: function() {

                    // Extend the core with enquire and get.state extensions
                    core.state = {
                        enquire: enquire,
                        get: get.state
                    };

                    // Patch the enquire object attached to the core
                    set.patch();

                    // Extend the sandbox for use within components
                    sandbox.state = {
                        get: get.state,
                        register: core.state.enquire.registerCustom
                    };

                    // Register the media events changes
                    set.medias();
                },

                // Sets the current state of the view
                state: function( event ) {
                    state = states[ event.replace( /^state.match./, '' )].size;
                },

                // Loops through the configure states and setups the media queries break points
                medias: function() {
                    var size,
                        media;

                    for ( size in states ) {
                        media = query.replace( '{{min-break-point}}', states[ size ].min ).replace( '{{max-break-point}}', states[ size ].max );
                        set.media( size, media );
                    }
                },

                // Sets a single media query break point
                media: function( size, media ) {
                    core.state.enquire.registerCustom( media, {
                        unmatch: function() {
                            sandbox.emit( 'state.unmatch.' + size );
                        },
                        match: function() {
                            set.state( size );
                            sandbox.emit( 'state.match.' + size );
                        }
                    });
                },

                // Patch to the Enquiy JS API to ensure that unmatched events always fire before matched events. https://github.com/WickyNilliams/enquire.js/issues/38#issuecomment-14451379
                patch: function() {

                    var toUnmatch = null,
                        enquire = core.state.enquire;

                    enquire.registerCustom = function( q, options, shouldDegrade ) {
                        var match,
                            unmatch;
                        if ( typeof options === 'function' ) {
                            options = {
                                match: options
                            };
                        }
                        match = options.match;
                        unmatch = options.unmatch;
                        if ( unmatch ) {
                            delete options.unmatch;
                        }
                        options.match = function() {
                            if ( toUnmatch ) {
                                toUnmatch();
                                toUnmatch = null;
                            }
                            if ( unmatch ) {
                                toUnmatch = unmatch;
                            }
                            match();
                        };
                        return enquire.register( q, options, shouldDegrade );
                    };
                }
            };

        return {
            initialize: function() {
                var detection = core.detection;

                detection.load({
                    test: detection.supported( 'matchMedia', window ),
                    fail: 'extensions/state/vendor/polyfills/media-match-2.0.2.js',
                    always: 'extensions/state/vendor/enquire-2.0.2.js',
                    finished: set.enquire
                });
            }
        };
    };
});
