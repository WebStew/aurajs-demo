define([ 'text!./template.hbs' ], function( template ) {

    var sandbox,
        component,

        // Setter functions
        set = {
            text: function() {
                sandbox.dom.text( component.$state, sandbox.state.get());
            }
        };

    return {
        initialize: function() {

            // Cache pointers to this component and the components sandbox
            component = this;
            sandbox = component.sandbox;

            // Write in the HTML template and current state
            component.html( template );
            component.$state = component.$find( '.state' );
            set.text();

            // Bind to all state matched events
            sandbox.on( 'state.match.*', set.text );
        }
    };
});
