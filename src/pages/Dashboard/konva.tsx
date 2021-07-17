import React, { useContext, useEffect, useState, useRef } from 'react';
import { Grid, Paper } from '@material-ui/core';
import useImage from 'use-image';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';

import { DashboardContext, DashboardContextType } from '../../common/context/dashboardContext';

import { Stage, Layer, Rect, Circle, Shape, Image } from 'react-konva';
import Konva from 'konva';


const useStyles = makeStyles((theme) => ({
    paper: {
        padding: theme.spacing(2),
        display: 'flex',
        overflow: 'auto',
        flexDirection: 'column'
    },
    fixedHeight: {
        //height: 240,
    }
}));


interface KonvaProps {
    //resultsCallback: (results: any)=>void
}


export const KonvaTest = (props: KonvaProps) => {
    const classes = useStyles();

    const dContext = useContext<DashboardContextType>(DashboardContext);

    const LX = 195;
    const LY = 215;
    const RX = 318;
    const RY = 215;

    // const [lx, setlx] = useState(LX)
    // const [ly, setly] = useState(LY)
    // const [rx, setrx] = useState(RX)
    // const [ry, setry] = useState(RY)

    const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);

    const circl = useRef<any>(null);
    const circr = useRef<any>(null);

    //download dog image
    const DogImage = () => {
        const [image] = useImage('/dog.png');
        return <Image image={image} width={512} height={512} />;
    }

    //calculate eye pupuls on mouse move
    const onMouseMove = (e: any) => {

        //cursor coordinates
        let cx = e.evt.layerX;
        let cy = e.evt.layerY;

        //calculate left eye
        let cxl = (cx - LX) / 10;  //distance from left X
        let cyl = (cy - LY) / 10;  //distance from left Y

        //calculate right eye
        let cxr = (cx - RX) / 10;  //distance from left X
        let cyr = (cy - RY) / 10;  //distance from left Y

        //set left eye
        circl.current.to({
            x: cxl < 15 ? LX + cxl : LX + 15,
            y: cyl < 15 ? LY + cyl : LY + 15
        })

        //set right eye
        circr.current.to({
            x: cxr < 15 ? RX + cxr : RX + 15,
            y: cyr < 15 ? RY + cyr : RY + 15
        })
    }

    //make color change on mouse click
    const onMouseDown = (e: any) => {
        //set left eye
        circl.current.to({
            fill:"red"
        })

        //set right eye
        circr.current.to({
            fill:'red'
        })
    }

    //make color change on mouse click
    const onMouseUp = (e: any) => {
        //set left eye
        circl.current.to({
            fill:"black"
        })

        //set right eye
        circr.current.to({
            fill:'black'
        })

    }

    return <>
        <Grid container spacing={3}>
            {/* Search Dogs */}
            <Grid item xs={12}>
                <Paper className={fixedHeightPaper}>
                    <Stage
                        style={{margin:"0 auto"}}
                        width={512}
                        height={512}
                        onMouseMove={onMouseMove}
                        onMouseDown={onMouseDown}
                        onMouseUp={onMouseUp}
                    >
                        <Layer>
                            <Circle ref={circl}
                                x={LX}
                                y={LY}
                                radius={10}
                                fill="black"
                            />
                            <Circle ref={circr}
                                x={RX}
                                y={RY}
                                radius={10}
                                fill="black"
                            />
                        </Layer>

                        <Layer>
                            <DogImage />
                        </Layer>
                    </Stage>
                </Paper>
            </Grid>
        </Grid>
    </>
}

export default KonvaTest;