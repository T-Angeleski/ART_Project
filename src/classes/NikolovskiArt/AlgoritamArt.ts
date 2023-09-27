export class Neuron {
    weights: number[];

    activation: number;

    output: number;

    bad_match: boolean;

    committed: boolean;

    private algorithmRef: AlgoritamART;

    public NeuronDefaultConstructor(algorithmRef: AlgoritamART, param1Int: number) {
        this.algorithmRef = algorithmRef;
        this.bad_match = false;
        this.committed = false;
        this.weights = new Number[param1Int];
        for (let b = 0; b < param1Int; b++)
            this.weights[b] = Math.random();
    }


    private copyArray = (src: number[], srcPos: number, dest: number[], destPos: number, len: number) => {
        for (let i = 0; i < len; i++) {
            dest[destPos + i] = src[srcPos + i];
        }
    }

    public NeuronArrayConstructor(algorithmRef: AlgoritamART, param1ArrayOfdouble: number[]) {
        this.algorithmRef = algorithmRef;
        this.bad_match = false;
        this.committed = false;
        this.weights = new Number[param1ArrayOfdouble.length];
        //System.arraycopy(param1ArrayOfdouble, 0, this.weights, 0, param1ArrayOfdouble.length);
        this.copyArray(param1ArrayOfdouble, 0, this.weights, 0, param1ArrayOfdouble.length);
    }

    public activate(param1ArrayOfdouble: number[]) {
        this.activation = this.calculateDistance(param1ArrayOfdouble, this.weights);
        this.output = 0.0;
        this.bad_match = false;
    }

    public calculateDistance(param1ArrayOfdouble1: number[], param1ArrayOfdouble2: number[]): number {
        let d = 0.0;
        for (let b = 0; b < param1ArrayOfdouble1.length; b++) {
            let d1 = param1ArrayOfdouble1[b] - param1ArrayOfdouble2[b];
            d += d1 * d1;
        }
        return Math.sqrt(d);
    }

    public learn(param1ArrayOfdouble: number[]) {
        for (let b = 0; b < param1ArrayOfdouble.length; b++)
            this.weights[b] = this.weights[b] + AlgoritamART.learning_rate * (param1ArrayOfdouble[b] - this.weights[b]);
        this.output = 1.0;
    }
}

export class AlgoritamART {
    public num_inputs = 0;
    public num_neurons = 0;
    public num_init_neurons: number;
    public static learning_rate = 0.1;
    public static vigilance = 0.9;

    protected tolerance: number;
    public setTolerance(vigilance: number) {
        this.tolerance = 1.0 - vigilance;
    }

    protected inputs: number[] = null;
    protected neurons: Array<Neuron> = new Array<Neuron>;

    constructor(param1: number, param2: number) {
        this.num_inputs = param1;
        this.num_init_neurons = param2;

        while (this.num_neurons < this.num_init_neurons) {
            this.addNeuronInt(this.num_inputs);
        }
    }

    public addNeuronInt(param: number) {
        let neuron = new Neuron();
        neuron.NeuronDefaultConstructor(this, param); // this should be reference to algoritam ??
        this.neurons.push(neuron);
        this.num_neurons++;
    }

    public addNeuronArray(paramArray: number[]) {
        let neuron = new Neuron();
        neuron.NeuronArrayConstructor(this, paramArray);
        this.neurons.push(neuron);
        neuron.committed = true;
        this.num_neurons++;
    }

    public activate(paramArray:number[]):Neuron {
        this.inputs = paramArray;
        this.neurons.forEach(n => {
            n.activate(this.inputs)
        })

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

    public getClosestNeuron(inputs: number[]):Neuron {
        throw new Error("Method not implemented.");
    }

    public train(paramArray: number[]) {
        this.inputs = paramArray;

    }

    // TODO FINISH IMPLEMENTING
}