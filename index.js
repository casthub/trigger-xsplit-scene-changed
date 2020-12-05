module.exports = class extends window.casthub.card.trigger {

    /**
     * @return {Promise}
     */
    async mounted() {
        const { id } = this.identity;

        // Open the WebSocket Connection to XSplit Broadcaster.
        this.ws = await window.casthub.ws(id);

        // Listen to a Scene change.
        this.ws.on('scenechange', ({ id }) => {
            if (this.props.scene === '_any' || this.props.scene === id) {
                this.trigger({
                    subject: id,
                });
            }
        });

        await super.mounted();
    }

    /**
     * @return {Promise}
     */
    async prepareProps() {
        const raw = this.ws.send('getAllScenes');
        let scenes = raw.reduce((obj, scene) => {
            obj[scene.id] = {
                name: scene.name,
            };

            return obj;
        }, {});

        scenes = {
            _any: {
                text: '-- Any --',
            },
            ...scenes,
        };

        return {
            scene: {
                type: 'select',
                label: 'Scene',
                default: '_any',
                options: scenes,
            },
        };
    }

};
