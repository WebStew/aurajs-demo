define(function() {

    return function( application ) {

        var core = application.core,
            sandbox = application.sandbox,
            methods = {},
            facade = {

                // A facade of the used Modernizr load methods http://modernizr.com/docs/#load
                resources: function() {

                    // http://modernizr.com/docs/#load
                    methods.load = function ( options ) {
                        Modernizr.load({
                            test: options.test,
                            nope: options.fail,
                            both: options.always,
                            complete: options.finished
                        });
                    };
                },

                // A facade of the used Modernizr available DOM features http://modernizr.com/docs/#prefixeddom
                tests: function() {

                    // http://modernizr.com/docs/#prefixeddom
                    methods.supported = function( api, context ) {
                        return Modernizr.prefixed( api , context );
                    };
                }
            };

        return {
            initialize: function() {

                // Create the additional resources methods on the facade
                facade.resources();
                facade.tests();

                // Extend the core and sandbox with Modernizr facade
                core.detection = sandbox.detection = methods;
            }
        };
    };
});
