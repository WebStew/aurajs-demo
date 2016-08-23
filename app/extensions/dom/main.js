define([ 'jquery' ], function( $ ) {

    return function( application ) {

        var core = application.core,
            sandbox = application.sandbox,
            methods = {},
            facade = {

                // A facade of the used jQuery manipulation methods http://api.jquery.com/category/manipulation/
                manipulation: function() {

                    // http://api.jquery.com/text/
                    methods.text = function ( selector, value ) {
                        return $( selector ).text( value );
                    };
                }
            };

        return {
            initialize: function() {

                // Create the additional manipulation methods on the facade
                facade.manipulation();

                // Extend the core and sandbox with extended DOM facade
                core.util.extend( core.dom, methods );
                core.util.extend( sandbox.dom, methods );
            }
        };
    };
});
