import React, { Fragment } from 'react';
import Head from 'next/head';

const Layout = props => (
    <Fragment>
        <Head>
            <meta charSet="utf-8" />
            <link href="http://stackpath.bootstrapcdn.com/bootstrap/4.1.1/css/bootstrap.min.css" rel="stylesheet" 
                integrity="sha384-WskhaSGFgHYWDcbwN70/dfYBj47jz9qbsMId/iRN3ewGhXQFZCSftd1LZCfmhktB" 
                crossOrigin="anonymous"
            />            
            <title>{ props.pageTitle }</title>
        </Head>
        {props.children}
    </Fragment>
);

export default Layout;