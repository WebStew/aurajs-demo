require([ 'bower_components/aura/lib/aura' ], function( Aura ) {

    Aura({
        sources: {
            default: 'components'
        },
        version: '1.1'
    })
    .use( 'extensions/dom/main' )
    .use( 'extensions/detection/main' )
    .use( 'extensions/state/main' )
    .use( function( application ) {
        window.WOL = application;
    })
    .start({
        components: 'body'
    })
    .then(function() {
        console.log( 'Application has started' );
    });
});
