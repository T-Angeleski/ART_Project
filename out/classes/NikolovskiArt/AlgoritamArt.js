"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlgoritamART = exports.Neuron = void 0;
class Neuron {
    constructor() {
        this.copyArray = (src, srcPos, dest, destPos, len) => {
            for (let i = 0; i < len; i++) {
                dest[destPos + i] = src[srcPos + i];
            }
        };
    }
    NeuronDefaultConstructor(algorithmRef, param1Int) {
        this.algorithmRef = algorithmRef;
        this.bad_match = false;
        this.committed = false;
        this.weights = new Number[param1Int];
        for (let b = 0; b < param1Int; b++)
            this.weights[b] = Math.random();
    }
    NeuronArrayConstructor(algorithmRef, param1ArrayOfdouble) {
        this.algorithmRef = algorithmRef;
        this.bad_match = false;
        this.committed = false;
        this.weights = new Number[param1ArrayOfdouble.length];
        //System.arraycopy(param1ArrayOfdouble, 0, this.weights, 0, param1ArrayOfdouble.length);
        this.copyArray(param1ArrayOfdouble, 0, this.weights, 0, param1ArrayOfdouble.length);
    }
    activate(param1ArrayOfdouble) {
        this.activation = this.calculateDistance(param1ArrayOfdouble, this.weights);
        this.output = 0.0;
        this.bad_match = false;
    }
    calculateDistance(param1ArrayOfdouble1, param1ArrayOfdouble2) {
        let d = 0.0;
        for (let b = 0; b < param1ArrayOfdouble1.length; b++) {
            let d1 = param1ArrayOfdouble1[b] - param1ArrayOfdouble2[b];
            d += d1 * d1;
        }
        return Math.sqrt(d);
    }
    learn(param1ArrayOfdouble) {
        for (let b = 0; b < param1ArrayOfdouble.length; b++)
            this.weights[b] = this.weights[b] + AlgoritamART.learning_rate * (param1ArrayOfdouble[b] - this.weights[b]);
        this.output = 1.0;
    }
}
exports.Neuron = Neuron;
class AlgoritamART {
    setTolerance(vigilance) {
        this.tolerance = 1.0 - vigilance;
    }
    constructor(param1, param2) {
        this.num_inputs = 0;
        this.num_neurons = 0;
        this.inputs = null;
        this.neurons = new Array;
        this.num_inputs = param1;
        this.num_init_neurons = param2;
        while (this.num_neurons < this.num_init_neurons) {
            this.addNeuronInt(this.num_inputs);
        }
    }
    addNeuronInt(param) {
        let neuron = new Neuron();
        neuron.NeuronDefaultConstructor(this, param); // this should be reference to algoritam ??
        this.neurons.push(neuron);
        this.num_neurons++;
    }
    addNeuronArray(paramArray) {
        let neuron = new Neuron();
        neuron.NeuronArrayConstructor(this, paramArray);
        this.neurons.push(neuron);
        neuron.committed = true;
        this.num_neurons++;
    }
    activate(paramArray) {
        this.inputs = paramArray;
        this.neurons.forEach(n => {
            n.activate(this.inputs);
        });
        let bool = false;
        let neuron = this.getClosestNeuron(this.inputs);
        while (!bool && neuron != null) {
            if (neuron.committed && neuron.activation >= this.tolerance) {
                neuron.bad_match = true;
                neuron = this.getClosestNeuron(this.inputs);
                continue;
            }
            neuron.output = 1.0;
            bool = true;
        }
        return neuron;
    }
    getClosestNeuron(inputs) {
        throw new Error("Method not implemented.");
    }
    train(paramArray) {
        this.inputs = paramArray;
    }
}
exports.AlgoritamART = AlgoritamART;
AlgoritamART.learning_rate = 0.1;
AlgoritamART.vigilance = 0.9;
//# sourceMappingURL=AlgoritamArt.js.map