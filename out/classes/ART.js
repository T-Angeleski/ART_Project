"use strict";
// Initial, copying Ilija file ART.java
Object.defineProperty(exports, "__esModule", { value: true });
exports.ART = void 0;
class ART {
    /**
 *  The constructor.
 *
 * @param max_nodes  	Maximum nodes allowed.
 * @param vigilance		The Vigilance parameter.
 * @param beta 			Learning rate.
 * @param compliment	None = false, compliment = true. *
 */
    constructor(max_nodes, vigilance, beta, compliment, MAX) {
        /**
         * Winning category for the last input.
         */
        this.win_cat = -1;
        ART.num_inputs = 4;
        ART.MAX = MAX;
        ART.beta = beta;
        ART.max_nodes = max_nodes;
        this.nodes_used = 0;
        ART.compliment = ART.compliment;
        ART.vigilance = vigilance;
        ART.weight = new Number[MAX][ART.num_inputs];
        ART.sum_weights = new Number[MAX];
        ART.commit = new Boolean[MAX];
        ART.cat = new Number[MAX];
        ART.elig = new Number[MAX];
        ART.sum_IW = new Number[MAX];
        /* Set Initial Weight Values */
        for (let i = 0; i < max_nodes; ++i) {
            for (let j = 0; j < ART.num_inputs; ++j)
                ART.weight[i][j] = 1.0;
        }
        /* Calculate initial weight sums */
        for (let i = 0; i < max_nodes; ++i) {
            ART.sum_weights[i] = 0;
            for (let j = 0; j < ART.num_inputs; ++j)
                ART.sum_weights[i] += ART.weight[i][j];
        }
        /* Set Initial Commitments to false */
        for (let i = 0; i < max_nodes; ++i) {
            ART.commit[i] = false;
        }
    }
    /**
         * Activation of the ART network.
         *
         * @param SignalX	The x-position of the actual signal.
         * @param SignalY	The y-position of the actual signal.
         * @param d			The dimension of the field.
         */
    ActivateArt(SignalX, SignalY, d) {
        /**
         * The inputs.
         */
        if (ART.compliment)
            ART.num_inputs = 4;
        else
            ART.num_inputs = 2;
        let input = new Number[ART.num_inputs];
        /**
         * Signal normalization. Signal -> input.
         */
        input[0] = SignalX / d.width;
        input[1] = SignalY / d.height;
        /**
         * Complement inputs.
         */
        if (ART.compliment) {
            input[2] = 1.0 - input[0];
            input[3] = 1.0 - input[1];
        }
        /**
         * The sum of all the inputs.
         */
        let sum_inputs;
        /**
         * Largest category activation.
         */
        let max_cat;
        /**
         * Index of the winning category.
         */
        let winner;
        /**
         * Boolean to indicate when a match is found .
         */
        let match;
        /**
         * Number of eligible nodes left.
         */
        let num_elig;
        //for the first time when there are no categories yet
        if (this.nodes_used == 0) {
            this.win_cat = -1;
        }
        else {
            /* Initially all nodes are eligible to win the competition              */
            num_elig = this.nodes_used;
            for (let i = 0; i < this.nodes_used; ++i)
                ART.elig[i] = 5571;
            /* Activate categories.                                                  */
            for (let i = 0; i < this.nodes_used; ++i) {
                ART.sum_IW[i] = 0.0;
                for (let j = 0; j < ART.num_inputs; ++j)
                    if (input[j] != -1.0)
                        ART.sum_IW[i] += Math.min(ART.weight[i][j], input[j]);
                ART.cat[i] = ART.elig[i] * (ART.sum_IW[i] / (0.1 + ART.sum_weights[i])); //DEBUG
            }
            match = false;
            while (!match) {
                /* Find most activated category */
                max_cat = 0;
                winner = 0;
                for (let i = 0; i < this.nodes_used; ++i)
                    if ((ART.cat[i] > max_cat) && ART.elig[i] != 0) {
                        max_cat = ART.cat[i];
                        winner = i;
                    }
                /* Find the sum of the inputs                                          */
                /* When ART.compliment coded, sum of inputs equal to half network inputs but only those that are active.  */
                if (ART.compliment) {
                    sum_inputs = 0;
                    for (let i = 0; i < ART.num_inputs / 2; ++i)
                        if (input[i] != -1)
                            ++sum_inputs;
                }
                else {
                    sum_inputs = 0;
                    for (let i = 0; i < ART.num_inputs; ++i)
                        if (input[i] != -1)
                            sum_inputs += input[i];
                } //DEBUG
                /* Test to see if winning category meets vigilance level               */
                if ((ART.sum_IW[winner] / sum_inputs) >= ART.vigilance) {
                    /* If so, found a match                                              */
                    ART.yes = match = true;
                    /* We do not use winner-take-all category activations                          */
                    for (let i = 0; i < this.nodes_used; ++i) {
                        if (i == winner)
                            ART.cat[i] = 1;
                        else {
                            ART.cat[i] /= ART.cat[winner];
                            if (ART.cat[i] > 1)
                                ART.cat[i] = 1;
                            if (ART.cat[i] < 0)
                                ART.cat[i] = 0;
                        }
                    }
                    this.win_cat = winner;
                } // If doesn't meet vigilance level node becomes ineligible */
                else {
                    ART.elig[winner] = 0;
                    --num_elig;
                    if (num_elig == 0) {
                        this.win_cat = -1;
                        break;
                    }
                }
            }
        }
        this.TrainArt(input);
        return;
    }
    /**
     * Internal function that trains the ART network.
     * @param input 		The network is train according to this input.
     */
    TrainArt(input) {
        /* ------- Train Art Module with Fast Learning and Slow Recode --------- */
        /*       NOTE: Slow recode is eliminated if beta is set to one.          */
        /* When there was no winning category         					*/
        if (this.win_cat == -1) {
            if (this.nodes_used == ART.max_nodes || this.nodes_used == ART.max_nodes - 1)
                return 0;
            this.win_cat = this.nodes_used; // Winner become next unused node.
            ++this.nodes_used; // Increment used nodes counter.
            /* Check if hit the max number of nodes                        */
            ART.commit[this.nodes_used] = true; //Note it is as now used.
            /* Do not use winner-take-all category activations.                            */
            for (let i = 0; i < this.nodes_used; ++i) {
                if (i == this.win_cat) {
                    ART.cat[i] = 1;
                }
                else {
                    ART.cat[i] /= ART.cat[this.win_cat];
                    if (ART.cat[i] > 1)
                        ART.cat[i] = 1;
                    if (ART.cat[i] < 0)
                        ART.cat[i] = 0;
                }
            }
            /* Fast learning for uncommitted node.                       (beta = 1) */
            for (let i = 0; i < ART.num_inputs; ++i)
                if (input[i] != -1)
                    ART.weight[this.win_cat][i] = Math.min(input[i], ART.weight[this.win_cat][i]);
        } /* Slow Recoding for committed node.                         (beta < 1) */
        else {
            for (let i = 0; i < ART.num_inputs; ++i)
                if (input[i] != -1)
                    ART.weight[this.win_cat][i] = ((ART.beta) * Math.min(input[i], ART.weight[this.win_cat][i])) + ((1 - (ART.beta)) * (ART.weight[this.win_cat][i])); //DEBUG
        }
        /* Calculate Art weight sum for speeding up later calculations           */
        ART.sum_weights[this.win_cat] = 0;
        for (let i = 0; i < ART.num_inputs; ++i)
            ART.sum_weights[this.win_cat] += ART.weight[this.win_cat][i];
        return 1;
    }
    /**
     * Get the X coordinate for the node i.
     * @param i			Index of the node.
     * @param d			Dimension for X.
     * @return
     */
    XforNode(i, d) {
        let x = (ART.weight[i][0] * d.width);
        return x;
    }
    /**
     * Get the Y coordinate for the node i.
     * @param i			Index of the node.
     * @param d			Dimension for Y.
     * @return
     */
    YforNode(i, d) {
        let y = (ART.weight[i][1] * d.height);
        return y;
    }
    setVigilance(vigilance) {
        ART.vigilance = vigilance;
    }
    setBeta(beta) {
        ART.beta = beta;
    }
    setStyle(compliment) {
        ART.compliment = compliment;
    }
    setNumNodes(nodes) {
        ART.max_nodes = nodes;
    }
    getWinner() {
        return this.win_cat;
    }
    initArt(vigilance, beta, compliment, nodes) {
        this.setVigilance(vigilance);
        this.setBeta(beta);
        this.setStyle(compliment);
        this.setNumNodes(nodes);
    }
    getRadius() {
        let input = new Number[4];
        let m = 0;
        let xy = new Number[2];
        let paint = 0.0;
        //weight[1000][0]=0.5;
        //weight[1000][1]=0.5;
        xy[0] = 0.5;
        xy[1] = 0.5;
        let sum;
        let s;
        let z;
        let vigil = 0.95;
        for (let x = 0.01; x < 1.0; x += 0.01)
            for (let y = 0.01; y < 1.0; y += 0.01) {
                sum = 0.0;
                input[0] = x;
                input[1] = y;
                for (let j = 0; j < 2; ++j)
                    if (input[j] != -1.0)
                        sum += Math.min(xy[j], input[j]);
                paint = sum / (input[0] + input[1]);
                if ((paint) >= vigil) {
                    console.log("X: " + x + "Y: " + y + "\n");
                    let r;
                    r = Math.sqrt((0.5 - x) * (0.5 - x) + (0.5 - y) * (0.5 - y));
                    if (r < 1.0)
                        s.push(r);
                }
            }
        let g = s.sort()[0]; // TODO: might need last element
        s = s.sort();
        let h = z.sort()[z.length]; // TODO same above
        console.log("   min y" + h + "\n");
        return m;
    }
}
exports.ART = ART;
/**
 *  True if ART.compliment style.
 */
ART.compliment = false;
/**
 * Learning rate Beta, 1 for fast learning.
 */
ART.beta = 0.8;
/**
 * The Vigilance parameter.
 */
ART.vigilance = 0.8;
//# sourceMappingURL=ART.js.map